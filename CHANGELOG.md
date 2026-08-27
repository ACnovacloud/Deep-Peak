# Changelog

Todos los cambios notables de la extensión **DeepSeek Peak Indicator** se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), y este proyecto respeta [Semantic Versioning](https://semver.org/lang/es/).

## [0.0.1] - 2026-08-27

### Añadido
- Indicador de color en la barra de estado según la tarifa actual de la API de DeepSeek:
  - 🟢 **Verde** — off-peak (precio con 50% de descuento).
  - 🟡 **Amarillo** — última hora de off-peak antes de que empiece el pico.
  - 🟠 **Naranja** — última hora del pico antes de que empiece el off-peak.
  - 🔴 **Rojo** — centro de la franja pico (tarifa 2x).
- Cálculo local de los horarios pico en UTC (sin llamadas a red), basado en la documentación oficial:
  - `01:00–04:00` y `06:00–10:00` UTC, de lunes a viernes.
- Refresco automático del indicador cada 60 segundos.
- Lógica de horarios en módulo independiente (`pricing.js`), testeable con `npm test`.

### Notas técnicas
- El indicador se pinta con un carácter de bloque sólido (`█`) usando `StatusBarItem.color`, porque `StatusBarItem.backgroundColor` de VS Code solo admite dos colores de tema (`statusBarItem.errorBackground` y `statusBarItem.warningBackground`).
