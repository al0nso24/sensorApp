//Persistencia local de la última ubicación conocida con AsyncStorage.
import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = '@sensorsapp/lastLocation';

export async function saveLastLocation(coords, timestamp) {
    try {
        const value = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp,
        };
        await AsyncStorage.setItem(KEY, JSON.stringify(value));
    } catch (e) {
        //Un fallo de almacenamiento no debe interrumpir la lectura de sensores.
        console.warn('No se pudo guardar la ubicación', e);
    }
}

export async function loadLastLocation() {
    try {
        const raw = await AsyncStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.warn('No se pudo leer la ubicación guardada', e);
        return null;
    }
}