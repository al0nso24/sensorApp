
//Hook que encapsula el GPS: permisos, ubicación en tiempo real, velocidad,
//distancia recorrida y persistencia de la última ubicación.
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Linking } from 'react-native';
import * as Location from 'expo-location';
import { haversineDistance } from '../utils/geo';
import { loadLastLocation, saveLastLocation } from '../storage/locationStorage';

const MIN_STEP_M = 1; //por debajo se considera ruido del GPS
const MAX_STEP_M = 100; //saltos mayores entre lecturas se descartan
const MOTION_WINDOW_MS = 3000; //el acelerómetro debe haber detectado movimiento recientemente
const MIN_GPS_SPEED = 0.5; //m/s; respaldo cuando el acelerómetro no está disponible

//status: 'loading' | 'granted' | 'denied' | 'error'
export default function useLocation(lastMovementAtRef) {
    const [status, setStatus] = useState('loading');
    const [errorMsg, setErrorMsg] = useState(null);
    const [coords, setCoords] = useState(null);
    const [timestamp, setTimestamp] = useState(null);
    const [distance, setDistance] = useState(0);
    const [savedLocation, setSavedLocation] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    //false cuando el sistema ya no muestra el diálogo (rechazado varias veces):
    //solo se puede conceder desde los ajustes del teléfono.
    const [canAskAgain, setCanAskAgain] = useState(true);

    //Al incrementarse se reinicia todo el flujo (permiso + suscripción al GPS).
    const [attempt, setAttempt] = useState(0);
    const prevCoordsRef = useRef(null);

    //Procesa cada lectura: actualiza estado, acumula distancia y la guarda.
    const handleLocation = useCallback(
        (location) => {
            const { coords: c, timestamp: ts } = location;
            const prev = prevCoordsRef.current;

            if (prev) {
                const step = haversineDistance(prev, c);

                //Combinación GPS + acelerómetro: solo se suma el tramo si el
                //dispositivo se movió de verdad (o el GPS reporta velocidad).
                const recentlyMoved =
                    lastMovementAtRef &&
                    Date.now() - lastMovementAtRef.current < MOTION_WINDOW_MS;

                const gpsMoving = c.speed != null && c.speed > MIN_GPS_SPEED;

                if (
                    step >= MIN_STEP_M &&
                    step <= MAX_STEP_M &&
                    (recentlyMoved || gpsMoving)
                ) {
                    setDistance((d) => d + step);
                }
            }

            prevCoordsRef.current = c;
            setCoords(c);
            setTimestamp(ts);
            saveLastLocation(c, ts);
        },
        [lastMovementAtRef]
    );

    const requestPermission = useCallback(async () => {
        const { status: permission, canAskAgain: askAgain } =
            await Location.requestForegroundPermissionsAsync();

        setCanAskAgain(askAgain);

        if (permission !== 'granted') {
            setStatus('denied');
            setErrorMsg(
                askAgain
                    ? 'Permiso denegado para acceder al GPS'
                    : 'Permiso denegado para acceder al GPS. Actívalo en los ajustes del teléfono.'
            );
            return false;
        }

        setStatus('granted');
        setErrorMsg(null);
        return true;
    }, []);

    useEffect(() => {
        let subscription = null;
        let cancelled = false;

        (async () => {
            setStatus('loading');

            const saved = await loadLastLocation();
            if (!cancelled) setSavedLocation(saved);

            try {
                const granted = await requestPermission();
                if (!granted || cancelled) return;

                const current = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });

                if (cancelled) return;

                handleLocation(current);

                subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 2000,
                        distanceInterval: 1,
                    },
                    handleLocation,
                    (reason) => setErrorMsg(`Error del GPS: ${reason}`)
                );

                //Si el componente se desmontó mientras se creaba la suscripción.
                if (cancelled) subscription.remove();
            } catch (e) {
                if (!cancelled) {
                    setStatus('error');
                    setErrorMsg(
                        'No se pudo obtener la ubicación. Verifica que el GPS esté activado.'
                    );
                }
            }
        })();

        return () => {
            cancelled = true;
            subscription && subscription.remove();
        };
    }, [handleLocation, requestPermission, attempt]);

    //Botón "Actualizar": si no hay permiso o hubo error reinicia el flujo
    //completo; si ya hay permiso fuerza una lectura nueva del GPS.
    const refresh = useCallback(async () => {
        if (status !== 'granted') {
            setAttempt((a) => a + 1);
            return;
        }

        setRefreshing(true);

        try {
            const current = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setErrorMsg(null);
            handleLocation(current);
        } catch (e) {
            setStatus('error');
            setErrorMsg(
                'No se pudo actualizar la ubicación. Verifica que el GPS esté activado.'
            );
        } finally {
            setRefreshing(false);
        }
    }, [status, handleLocation]);

    //Al volver a la app (por ejemplo, desde los ajustes) se reintenta si el
    //permiso estaba denegado o el GPS apagado.
    useEffect(() => {
        if (status !== 'denied' && status !== 'error') return undefined;

        const sub = AppState.addEventListener('change', async (next) => {
            if (next !== 'active') return;

            if (status === 'error') {
                //Solo se reintenta si el usuario ya activó la ubicación; de lo contrario
                //el diálogo del sistema volvería a aparecer en bucle.
                if (await Location.hasServicesEnabledAsync()) {
                    setAttempt((a) => a + 1);
                }
                return;
            }

            const { status: permission } =
                await Location.getForegroundPermissionsAsync();

            if (permission === 'granted') {
                setAttempt((a) => a + 1);
            }
        });

        return () => sub.remove();
    }, [status]);

    const openSettings = useCallback(() => Linking.openSettings(), []);
    const resetDistance = useCallback(() => setDistance(0), []);

    return {
        status,
        errorMsg,
        coords,
        timestamp,
        distance,
        savedLocation,
        refreshing,
        canAskAgain,
        refresh,
        openSettings,
        resetDistance,
    };
}