//Mapa con la posición actual (Android / iOS) usando react-native-maps.
import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { isRunningInExpoGo } from 'expo';
import Constants from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import MapFallback from './MapFallback';
import { colors, radius } from '../theme';

const DELTA = 0.005; //nivel de zoom aproximado de calle

//iOS usa Apple Maps (sin key) y Expo Go trae su propia key de Google Maps.
//En un APK propio de Android solo hay mapa si se configuró GOOGLE_MAPS_API_KEY.
const MAP_AVAILABLE = Platform.OS === 'ios' || isRunningInExpoGo() || Boolean(Constants.expoConfig?.extra?.hasGoogleMapsKey);

export default function LocationMap({ coords }) {
    const mapRef = useRef(null);

    //Centra el mapa cada vez que cambia la posición.
    useEffect(() => {
        if (coords && mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: DELTA,
                    longitudeDelta: DELTA,
                },
                500
            );
        }
    }, [coords]);

    if (!coords) return null;

    if (!MAP_AVAILABLE) {
        return (
            <MapFallback
                coords={coords}
                message="Mapa no disponible: esta versión se compiló sin API key de Google Maps."
            />
        );
    }

    return (
        <View style={styles.wrapper}>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFill}
                initialRegion={{
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: DELTA,
                    longitudeDelta: DELTA,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                    }}
                    title="Estás aquí"
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        height: 220,
        borderRadius: radius.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
});