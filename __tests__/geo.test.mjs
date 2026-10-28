//Pruebas unitarias de src/utils/geo.js con el test runner integrado de Node.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    formatDateTime,
    formatDistance,
    formatSpeed,
    haversineDistance,
} from '../src/utils/geo.js';

test('haversineDistance devuelve 0 para el mismo punto', () => {
    const p = { latitude: -12.0464, longitude: -77.0428 };
    assert.equal(haversineDistance(p, p), 0);
});

test('haversineDistance: 0.001° de latitud ≈ 111 m', () => {
    const a = { latitude: -12.0, longitude: -77.0 };
    const b = { latitude: -12.001, longitude: -77.0 };
    const d = haversineDistance(a, b);
    assert.ok(Math.abs(d - 111.19) < 0.5, `distancia obtenida ${d}`);
});

test('haversineDistance: Lima → Arequipa ≈ 765 km', () => {
    const lima = { latitude: -12.0464, longitude: -77.0428 };
    const arequipa = { latitude: -16.409, longitude: -71.5375 };
    const km = haversineDistance(lima, arequipa) / 1000;
    assert.ok(km > 755 && km < 775, `distancia obtenida ${km} km`);
});

test('haversineDistance devuelve 0 si falta un punto', () => {
    assert.equal(haversineDistance(null, { latitude: 0, longitude: 0 }), 0);
});

test('formatSpeed maneja null, negativo y valores válidos', () => {
    assert.equal(formatSpeed(null), '—');
    assert.equal(formatSpeed(-1), '—');
    assert.equal(formatSpeed(0), '0.00 m/s');
    assert.equal(formatSpeed(1.234), '1.23 m/s');
});

test('formatDistance cambia de metros a kilómetros', () => {
    assert.equal(formatDistance(12.34), '12.3 m');
    assert.equal(formatDistance(1500), '1.50 km');
});

test('formatDateTime usa formato dd/mm/aaaa hh:mm:ss', () => {
    assert.equal(formatDateTime(new Date(2025, 9, 28, 9, 5, 3)), '28/10/2025 09:05:03');
    assert.equal(formatDateTime(null), '—');
});