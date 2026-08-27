'use strict';

/**
 * Franjas pico de la API de DeepSeek (en UTC, lunes a viernes).
 * Fuente oficial: https://api-docs.deepseek.com/quick_start/pricing
 *  - Off-peak = 50% del precio pico.
 *  - Horas pico: 01:00-04:00 y 06:00-10:00 UTC, de lunes a viernes.
 *
 * Los horarios se expresan en minutos desde las 00:00 UTC.
 */
const PEAK_WINDOWS = [
  { start: 60, end: 240 }, // 01:00 - 04:00 UTC
  { start: 360, end: 600 }, // 06:00 - 10:00 UTC
];

const MINUTE = 60;

const STATE = {
  GREEN: 'green',
  YELLOW: 'yellow',
  ORANGE: 'orange',
  RED: 'red',
};

/**
 * Colores (hex) del bloque indicador para cada estado.
 * Nota: `StatusBarItem.backgroundColor` solo soporta los colores de tema
 * `statusBarItem.errorBackground` y `statusBarItem.warningBackground`, así que
 * el bloque se pinta con `StatusBarItem.color` (que sí acepta cualquier hex).
 */
const COLORS = {
  [STATE.GREEN]: '#2E7D32',
  [STATE.YELLOW]: '#F9A825',
  [STATE.ORANGE]: '#EF6C00',
  [STATE.RED]: '#C62828',
};

/**
 * Devuelve el estado según la tarifa actual de DeepSeek.
 *
 *  - green   -> off-peak
 *  - yellow  -> última hora de off-peak antes de que empiece el pico
 *  - orange  -> última hora del pico antes de que empiece el off-peak
 *  - red     -> centro de la franja pico
 *
 * @param {Date} date Fecha a evaluar (se usa su representación UTC).
 * @returns {string} Uno de los valores de STATE.
 */
function getState(date) {
  const day = date.getUTCDay(); // 0 = domingo ... 6 = sábado
  if (day === 0 || day === 6) {
    return STATE.GREEN; // el fin de semana completo es off-peak
  }

  const minutes = date.getUTCHours() * 60 + date.getUTCMinutes();

  for (const { start, end } of PEAK_WINDOWS) {
    // Última hora de off-peak antes de que empiece el pico -> amarillo
    if (minutes >= start - MINUTE && minutes < start) {
      return STATE.YELLOW;
    }
    // Dentro de la franja pico
    if (minutes >= start && minutes < end) {
      // Última hora del pico antes de que empiece el off-peak -> naranja
      if (minutes >= end - MINUTE) {
        return STATE.ORANGE;
      }
      return STATE.RED;
    }
  }

  return STATE.GREEN;
}

module.exports = { getState, COLORS, STATE, PEAK_WINDOWS };
