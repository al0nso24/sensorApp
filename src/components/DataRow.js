//Fila etiqueta / valor usada en las tarjetas de datos
import { StyleSheet, Text, View } from 'react-native';
import { spacing, typography } from '../theme';

export default function DataRow({ label, value, valueStyle }) {
    return (
        <View style={styles.row}>
            <Text style={typography.label}>{label}</Text>
            <Text style={[typography.value, valueStyle]}>
                {value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.xs,
        gap: spacing.md,
    },
});