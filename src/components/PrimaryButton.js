//Botón reutilizable con variantes "primary" y "secondary" y estado de carga.
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function PrimaryButton({ title, onPress, loading, variant = 'primary', style }) {
    const secondary = variant === 'secondary';
    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress}
            disabled={loading}
            style={({ pressed }) => [
                styles.button,
                secondary && styles.secondary,
                pressed && { opacity: 0.8 },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={secondary ? colors.primary : colors.primaryText} />
            ) : (
                <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: 48,
        borderRadius: radius.md,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
    },

    secondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.primary,
    },

    text: { 
        color: colors.primaryText, 
        fontSize: 16, 
        fontWeight: '700' 
    },

    secondaryText: { 
        color: colors.primary 
    },
});