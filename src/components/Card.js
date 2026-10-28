//Contenedor visual reutilizable para cada bloque de información.
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
export default function Card({ title, right, children, style }) {
    return (
        <View style={[styles.card, style]}>
            {title ? (
                <View style={styles.header}>
                    <Text style={typography.cardTitle}>{title}</Text>
                    {right}
                </View>
            ) : null}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        marginBottom: spacing.md,
    },
    
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
});