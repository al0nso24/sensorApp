//Utilidades de geolocalización: distancia entre coordenadas y formato de valores.
const EARTH_RADIUS_M = 6371000;
const toRad = (deg) => (deg * Math.PI) / 180;

//Distancia en metros entre dos puntos {latitude, longitude} (fórmula de Haversine).
export function haversineDistance(a, b) {
    if (!a || !b) return 0;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
    return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

//coords.speed puede ser null (web) o negativo (iOS cuando no es válido).
export function formatSpeed(speed) {
    if (speed == null || Number.isNaN(speed) || speed < 0) return '—';
    return `${speed.toFixed(2)} m/s`;
}

export function formatDistance(meters) {
    if (meters < 1000) return `${meters.toFixed(1)} m`;
    return `${(meters / 1000).toFixed(2)} km`;
}

//Fecha y hora legibles en español, p. ej. "28/10/2025 14:05:09".
export function formatDateTime(date) {
    if (!date) return '—';
    const d = date instanceof Date ? date : new Date(date);
    const pad = (n) => String(n).padStart(2, '0');
    return (
        `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ` +
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    );
}