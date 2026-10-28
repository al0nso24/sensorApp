//Pruebas unitarias de src/utils/motion.js (reglas de sacudida y movimiento).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isMoving, isShake, magnitude, pushHistory } from '../src/utils/motion.js';

test('isShake: dispositivo en reposo no es sacudida', () => {
    assert.equal(isShake({ x: 0, y: 0, z: 1 }), false);
});

test('isShake: |x| > 1.5 o |y| > 1.5 es sacudida (incluye negativos)', () => {
    assert.equal(isShake({ x: 1.6, y: 0, z: 1 }), true);
    assert.equal(isShake({ x: 0, y: -1.8, z: 1 }), true);
});

test('isShake: exactamente 1.5 no supera el umbral', () => {
    assert.equal(isShake({ x: 1.5, y: 1.5, z: 1 }), false);
});

test('isShake: el eje z no se considera', () => {
    assert.equal(isShake({ x: 0, y: 0, z: 3 }), false);
});

test('magnitude calcula la norma del vector', () => {
    assert.equal(magnitude({ x: 3, y: 4, z: 0 }), 5);
});

test('isMoving: reposo (~1 g) vs movimiento', () => {
    assert.equal(isMoving({ x: 0, y: 0, z: 1 }), false);
    assert.equal(isMoving({ x: 0.02, y: 0.01, z: 1.03 }), false);
    assert.equal(isMoving({ x: 0.5, y: 0.3, z: 1.2 }), true);
});

test('pushHistory conserva solo las últimas 5 lecturas, la más reciente primero', () => {
    let history = [];
    for (let i = 1; i <= 7; i++) history = pushHistory(history, { at: i });
    assert.deepEqual(
        history.map((h) => h.at),
        [7, 6, 5, 4, 3]
    );
});