//Hook que encapsula el acelerómetro: lectura en tiempo real, detección de
//sacudidas, estado de movimiento e historial de las últimas 5 sacudidas.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Accelerometer } from 'expo-sensors';
import { isMoving, isShake, pushHistory } from '../utils/motion';

const UPDATE_INTERVAL_MS = 200;
const SHAKE_VISIBLE_MS = 1500; //tiempo visible la alerta
const SHAKE_COOLDOWN_MS = 1000; //evita registrar la misma sacudida varias veces

export default function useAccelerometer() {
    const [available, setAvailable] = useState(null); //null = comprobando
    const [data, setData] = useState({ x: 0, y: 0, z: 0 });
    const [lastReadingAt, setLastReadingAt] = useState(null);
    const [shakeActive, setShakeActive] = useState(false);
    const [history, setHistory] = useState([]);
    const [moving, setMoving] = useState(false);
    const lastShakeRef = useRef(0);
    const wasShakingRef = useRef(false);

    //Último instante en que se detectó movimiento; lo usa useLocation para
    //decidir si un cambio de GPS es desplazamiento real o ruido.
    const lastMovementAtRef = useRef(0);
    const hideTimerRef = useRef(null);

    useEffect(() => {
        let subscription = null;
        let cancelled = false;
        (async () => {
            const isAvailable = await Accelerometer.isAvailableAsync();
            if (cancelled) return;
            setAvailable(isAvailable);
            if (!isAvailable) return;
            Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);
            subscription = Accelerometer.addListener((reading) => {
                const now = Date.now();
                setData(reading);
                setLastReadingAt(new Date(now));
                const movingNow = isMoving(reading);
                if (movingNow) lastMovementAtRef.current = now;
                setMoving(movingNow);
                
                //Se registra solo al cruzar el umbral (flanco de subida), para que una
                //sacudida sostenida no se cuente varias veces.
                const shaking = isShake(reading);
                const startedShaking = shaking && !wasShakingRef.current;
                wasShakingRef.current = shaking;
                if (startedShaking && now - lastShakeRef.current > SHAKE_COOLDOWN_MS) {
                    lastShakeRef.current = now;
                    setShakeActive(true);
                    setHistory((prev) =>
                        pushHistory(prev, { x: reading.x, y: reading.y, z: reading.z, at: now })
                    );
                    clearTimeout(hideTimerRef.current);
                    hideTimerRef.current = setTimeout(() => setShakeActive(false), SHAKE_VISIBLE_MS);
                }
            });
        })();

        return () => {
            cancelled = true;
            clearTimeout(hideTimerRef.current);
            subscription && subscription.remove();
        };
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
        setShakeActive(false);
    }, []);

    return {
        available,
        data,
        lastReadingAt,
        shakeActive,
        moving,
        history,
        clearHistory,
        lastMovementAtRef,
    };
}