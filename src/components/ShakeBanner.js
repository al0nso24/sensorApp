//Alerta visual que aparece al detectar un movimiento brusco.
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function ShakeBanner({ visible }) {
    if (!visible) return null;
    return (
        <View style={styles.banner} accessibilityRole="alert" accessibilityLiveRegion="assertive">
            <Text style={styles.title}>¡Movimiento brusco detectado!</Text>
            <Text style={styles.text}>Se superó el umbral |x| o |y| &gt; 1.5 g</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        backgroundColor: colors.danger,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },

    title: { 
        color: '#FFFFFF', 
        fontSize: 16, 
        fontWeight: '700' 
    },
    
    text: { 
        color: '#FFFFFF', 
        fontSize: 13, 
        marginTop: 2 
    },
});