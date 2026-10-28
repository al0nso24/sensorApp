//Configuración dinámica: parte de app.json y agrega la API key de Google Maps
//solo si existe la variable de entorno GOOGLE_MAPS_API_KEY.
//En Expo Go no se necesita; en un APK propio, Google Maps en Android la exige
//(sin ella la app se cerraría al mostrar el mapa).
module.exports = ({ config }) => {
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    return {
        ...config,
        plugins: [
            ...(config.plugins ?? []),
            ...(googleMapsApiKey
                ? [['react-native-maps', { androidGoogleMapsApiKey: googleMapsApiKey }]]
                : []),
        ],
        extra: {
            ...config.extra,
            hasGoogleMapsKey: Boolean(googleMapsApiKey),
        },
    };
};