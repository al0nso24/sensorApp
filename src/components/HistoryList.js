//Lista de las últimas 5 sacudidas registradas (más reciente primero).
import { StyleSheet, Text, View } from 'react-native';
import { formatDateTime } from '../utils/geo';
import { colors, spacing, typography } from '../theme';

export default function HistoryList({ items }) {
    if (items.length === 0) {
        return <Text style={typography.label}>Aún no se registran movimientos bruscos. Agita el dispositivo.</Text>;
    }

    return (
        <View>
            {items.map((item, index) => (
                <View key={item.at} style={[styles.item, index > 0 && styles.divider]}>
                    <Text style={styles.index}>{index + 1}</Text>
                    <View style={styles.body}>
                        <Text style={typography.value}>x {item.x.toFixed(2)} · y {item.y.toFixed(2)} · z {item.z.toFixed(2)}
                        </Text>
                        <Text style={typography.caption}>{formatDateTime(item.at)}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    item: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: spacing.sm 
    },
    
    divider: { 
        borderTopWidth: 1, 
        borderTopColor: colors.border 
    },

    index: { 
        width: 24, 
        fontWeight: '700', 
        color: colors.muted 
    },

    body: { 
        flex: 1 
    },
});