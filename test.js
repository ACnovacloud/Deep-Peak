'use strict';

const { getState } = require('./pricing');

// Jueves 2026-08-27 (día entre semana) como base.
const BASE = Date.UTC(2026, 7, 27); // 2026-08-27T00:00:00Z

// [minutos desde 00:00 UTC, estado esperado, descripción]
const CASOS = [
  [0 * 60 + 30, 'yellow', '00:30 UTC -> 1h antes de empezar el pico (amarillo)'],
  [0 * 60 + 50, 'yellow', '00:50 UTC -> 1h antes de empezar el pico (amarillo)'],
  [1 * 60 + 30, 'red', '01:30 UTC -> centro del pico (rojo)'],
  [3 * 60 + 30, 'orange', '03:30 UTC -> última hora del pico (naranja)'],
  [4 * 60 + 30, 'green', '04:30 UTC -> off-peak (verde)'],
  [5 * 60 + 30, 'yellow', '05:30 UTC -> 1h antes de empezar el pico (amarillo)'],
  [7 * 60 + 0, 'red', '07:00 UTC -> centro del pico (rojo)'],
  [9 * 60 + 30, 'orange', '09:30 UTC -> última hora del pico (naranja)'],
  [10 * 60 + 30, 'green', '10:30 UTC -> off-peak (verde)'],
  [23 * 60 + 0, 'green', '23:00 UTC -> off-peak (verde)'],
];

let fallos = 0;

for (const [minutos, esperado, desc] of CASOS) {
  const fecha = new Date(BASE + minutos * 60 * 1000);
  const actual = getState(fecha);
  const ok = actual === esperado;
  if (!ok) fallos++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${desc} -> ${actual} (esperado: ${esperado})`);
}

// Fin de semana: sábado 2026-08-29 y domingo 2026-08-30 -> siempre verde.
for (const dia of [29, 30]) {
  for (const horas of [3, 7, 9]) {
    const fecha = new Date(Date.UTC(2026, 7, dia, horas, 30));
    const actual = getState(fecha);
    const ok = actual === 'green';
    if (!ok) fallos++;
    console.log(
      `${ok ? 'PASS' : 'FAIL'} ${fecha.toISOString()} (fin de semana) -> ${actual} (esperado: green)`
    );
  }
}

console.log(
  fallos === 0
    ? '\nTODAS LAS PRUEBAS PASARON'
    : `\n${fallos} PRUEBA(S) FALLARON`
);
process.exit(fallos === 0 ? 0 : 1);
