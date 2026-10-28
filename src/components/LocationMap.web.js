//Versión web: react-native-maps no soporta web. Metro elige este archivo
//automáticamente al compilar para web gracias a la extensión .web.js
import MapFallback from './MapFallback';

export default function LocationMap({ coords }) {
    if (!coords) return null;
    return (
        <MapFallback
            coords={coords}
            message="El mapa interactivo está disponible en Android e iOS."
        />
    );
}