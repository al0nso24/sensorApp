//Reglas de negocio del acelerómetro (valores en g, 1 g = 9.81 m/s²).
//Umbral de sacudida definido en el laboratorio: |x| > 1.5 o |y| > 1.5.
export const SHAKE_THRESHOLD = 1.5;

//Desviación de la magnitud respecto a 1 g (gravedad en reposo) que se
//considera "el dispositivo se está moviendo".
export const MOVING_THRESHOLD = 0.08;
export const HISTORY_SIZE = 5;

export function isShake({ x, y }) {
    return Math.abs(x) > SHAKE_THRESHOLD || Math.abs(y) > SHAKE_THRESHOLD;
}

export function magnitude({ x, y, z }) {
    return Math.sqrt(x * x + y * y + z * z);
}

//En reposo la magnitud es ~1 g; si se aleja de 1 g el usuario está en movimiento.
export function isMoving(reading) {
    return Math.abs(magnitude(reading) - 1) > MOVING_THRESHOLD;
}

//Agrega una lectura al inicio y conserva solo las últimas `size` entradas.
export function pushHistory(history, entry, size = HISTORY_SIZE) {
    return [entry, ...history].slice(0, size);
}