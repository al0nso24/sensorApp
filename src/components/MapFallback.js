//Alternativa al mapa cuando no se puede mostrar (web, o APK sin API key de
//Google Maps): enlace a OpenStreetMap con la posición actual.
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

export default function MapFallback({ coords, message }) {
    const url = `https://www.openstreetmap.org/?mlat=${coords.latitude}&mlon=${coords.longitude}#map=17/${coords.
        latitude}/${coords.longitude}`;
    return (
        <View style={styles.box}>
            <Text style={typography.label}>{message}</Text>
            <Pressable onPress={() => Linking.openURL(url)} accessibilityRole="link">
                <Text style={styles.link}>Ver posición en OpenStreetMap</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        gap: spacing.sm,
    },

    link: { 
        color: colors.primary, 
        fontWeight: '700' 
    },
});