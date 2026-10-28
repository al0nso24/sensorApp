//Barra horizontal que representa el valor de un eje del acelerómetro en el rango [-2 g, 2 g], centrada en 0.
import { StyleSheet, Text, View } from 'react-native';
import { SHAKE_THRESHOLD } from '../utils/motion';
import { colors, spacing, typography } from '../theme';

const RANGE = 2;

export default function AxisBar({ axis, value }) {
    const clamped = Math.max(-RANGE, Math.min(RANGE, value));
    const widthPct = (Math.abs(clamped) / RANGE) * 50;
    const overThreshold = axis !== 'z' && Math.abs(value) > SHAKE_THRESHOLD;

    return (
        <View style={styles.row}>
            <Text style={styles.axis}>{axis}</Text>
            <View style={styles.track}>
                <View style={styles.center} />
                <View
                    style={[
                        styles.fill,
                        {
                            width: `${widthPct}%`,
                            left: clamped >= 0 ? '50%' : `${50 - widthPct}%`,
                            backgroundColor: overThreshold ? colors.danger : colors.primary,
                        },
                    ]}
                />
            </View>
            <Text style={[typography.value, styles.value]}>{value.toFixed(2)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: spacing.xs 
    },

    axis: { 
        width: 20, 
        fontWeight: '700', 
        color: colors.muted 
    },

    track: {
        flex: 1,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.background,
        overflow: 'hidden',
    },

    center: {
        position: 'absolute',
        left: '50%',
        width: 1,
        top: 0,
        bottom: 0,
        backgroundColor: colors.border,
    },

    fill: { 
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        borderRadius: 5 
    },

    value: { 
        width: 64, 
        textAlign: 'right' 
    },
});