//Pantalla principal: muestra GPS, acelerómetro, distancia e historial.
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAccelerometer from '../hooks/useAccelerometer';
import useLocation from '../hooks/useLocation';
import Card from '../components/Card';
import DataRow from '../components/DataRow';
import AxisBar from '../components/AxisBar';
import ShakeBanner from '../components/ShakeBanner';
import HistoryList from '../components/HistoryList';
import LocationMap from '../components/LocationMap';
import PrimaryButton from '../components/PrimaryButton';
import { formatDateTime, formatDistance, formatSpeed } from '../utils/geo';
import { magnitude } from '../utils/motion';
import { colors, radius, spacing, typography } from '../theme';

const STATUS_LABEL = {
    loading: { text: 'Solicitando GPS…', color: colors.muted },
    granted: { text: 'Permiso GPS concedido', color: colors.success },
    denied: { text: 'Permiso GPS denegado', color: colors.danger },
    error: { text: 'GPS no disponible', color: colors.danger },
};

export default function SensorsScreen() {
    const insets = useSafeAreaInsets();
    const accel = useAccelerometer();
    const gps = useLocation(accel.lastMovementAtRef);
    const status = STATUS_LABEL[gps.status];

    //Fecha y hora de la lectura más reciente de cualquiera de los dos sensores.
    const lastSensorReading = [
        accel.lastReadingAt,
        gps.timestamp && new Date(gps.timestamp),
    ]
        .filter(Boolean)
        .sort((a, b) => b - a)[0];

    return (
        <ScrollView
            style={[styles.screen, accel.shakeActive && styles.screenShake]}
            contentContainerStyle={{
                paddingTop: insets.top + spacing.lg,
                paddingBottom: insets.bottom + spacing.xl,
                paddingHorizontal: spacing.lg,
            }}
        >
            <Text style={typography.title}>Sensores del Dispositivo</Text>

            <View style={styles.headerRow}>
                <View style={[styles.chip, { borderColor: status.color }]}>
                    <View style={[styles.dot, { backgroundColor: status.color }]} />
                    <Text style={[styles.chipText, { color: status.color }]}>
                        {status.text}
                    </Text>
                </View>
            </View>

            <Text style={[typography.caption, styles.lastReading]}>
                Última lectura de sensores: {formatDateTime(lastSensorReading)}
            </Text>

            <ShakeBanner visible={accel.shakeActive} />

            {gps.errorMsg ? (
                <View style={styles.error} accessibilityRole="alert">
                    <Text style={styles.errorText}>{gps.errorMsg}</Text>

                    {gps.status === 'denied' && !gps.canAskAgain ? (
                        <PrimaryButton
                            title="Abrir ajustes"
                            variant="secondary"
                            onPress={gps.openSettings}
                            style={styles.errorButton}
                        />
                    ) : null}
                </View>
            ) : null}

            <Card title="Ubicación (GPS)">
                {gps.coords ? (
                    <>
                        <DataRow
                            label="Latitud"
                            value={gps.coords.latitude.toFixed(4)}
                        />
                        <DataRow
                            label="Longitud"
                            value={gps.coords.longitude.toFixed(4)}
                        />
                        <DataRow
                            label="Velocidad"
                            value={formatSpeed(gps.coords.speed)}
                        />
                        <DataRow
                            label="Precisión"
                            value={
                                gps.coords.accuracy != null
                                    ? `± ${gps.coords.accuracy.toFixed(0)} m`
                                    : '—'
                            }
                        />
                        <DataRow
                            label="Lectura GPS"
                            value={formatDateTime(gps.timestamp)}
                        />
                    </>
                ) : (
                    <Text style={typography.label}>
                        {gps.status === 'loading' || gps.status === 'granted'
                            ? 'Obteniendo ubicación…'
                            : 'Ubicación no disponible.'}
                    </Text>
                )}

                {gps.savedLocation && !gps.coords ? (
                    <View style={styles.saved}>
                        <Text style={typography.caption}>
                            Última ubicación guardada
                        </Text>
                        <Text style={typography.value}>
                            {gps.savedLocation.latitude.toFixed(4)},{' '}
                            {gps.savedLocation.longitude.toFixed(4)}
                        </Text>
                        <Text style={typography.caption}>
                            {formatDateTime(gps.savedLocation.timestamp)}
                        </Text>
                    </View>
                ) : null}
            </Card>

            {gps.coords ? (
                <Card title="Mapa">
                    <LocationMap coords={gps.coords} />
                </Card>
            ) : null}

            <Card
                title="Acelerómetro"
                right={
                    accel.available ? (
                        <Text
                            style={[
                                styles.badge,
                                accel.moving
                                    ? styles.badgeMoving
                                    : styles.badgeIdle,
                            ]}
                        >
                            {accel.moving ? 'En movimiento' : 'En reposo'}
                        </Text>
                    ) : null
                }
            >
                {accel.available === false ? (
                    <Text style={typography.label}>
                        El acelerómetro no está disponible en este dispositivo.
                    </Text>
                ) : (
                    <>
                        <AxisBar axis="x" value={accel.data.x} />
                        <AxisBar axis="y" value={accel.data.y} />
                        <AxisBar axis="z" value={accel.data.z} />
                        <DataRow
                            label="Magnitud"
                            value={`${magnitude(accel.data).toFixed(2)} g`}
                        />
                        <DataRow
                            label="Lectura"
                            value={formatDateTime(accel.lastReadingAt)}
                        />
                    </>
                )}
            </Card>

            <Card title="Distancia recorrida">
                <Text style={styles.bigValue}>
                    {formatDistance(gps.distance)}
                </Text>
                <Text style={typography.caption}>
                    Solo se suman los tramos de GPS cuando el acelerómetro
                    detecta movimiento o el GPS reporta velocidad.
                </Text>
            </Card>

            <Card title="Historial de movimiento (últimas 5)">
                <HistoryList items={accel.history} />
            </Card>

            <View style={styles.actions}>
                <PrimaryButton
                    title="Actualizar datos"
                    onPress={gps.refresh}
                    loading={gps.refreshing}
                />

                <View style={styles.actionsRow}>
                    <PrimaryButton
                        title="Reiniciar distancia"
                        variant="secondary"
                        onPress={gps.resetDistance}
                        style={styles.flex}
                    />

                    <PrimaryButton
                        title="Limpiar historial"
                        variant="secondary"
                        onPress={accel.clearHistory}
                        style={styles.flex}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },

    screenShake: {
        backgroundColor: colors.dangerSoft,
    },

    headerRow: {
        flexDirection: 'row',
        marginTop: spacing.sm,
    },

    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        gap: spacing.sm,
        backgroundColor: colors.surface,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    chipText: {
        fontSize: 13,
        fontWeight: '600',
    },

    lastReading: {
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
    },

    error: {
        backgroundColor: colors.dangerSoft,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },

    errorText: {
        color: colors.danger,
        fontWeight: '600',
    },

    errorButton: {
        marginTop: spacing.md,
    },
    
    saved: {
        marginTop: spacing.md,
        padding: spacing.md,
        borderRadius: radius.md,
        backgroundColor: colors.warningSoft,
        gap: 2,
    },

    badge: {
        fontSize: 12,
        fontWeight: '700',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: 999,
        overflow: 'hidden',
    },

    badgeMoving: {
        backgroundColor: colors.warningSoft,
        color: colors.warning,
    },

    badgeIdle: {
        backgroundColor: colors.background,
        color: colors.muted,
    },

    bigValue: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.xs,
    },

    actions: {
        gap: spacing.md,
        marginTop: spacing.sm,
    },

    actionsRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },

    flex: {
        flex: 1,
    },
});