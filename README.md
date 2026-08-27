# DeepSeek Peak Indicator

Extensión de VS Code super sencilla que muestra un **bloque de color en la barra de estado** según si la API de DeepSeek está en hora pico (tarifa 2x) u off-peak (50% de descuento).

## Colores

| Color  | Significado                                                                 |
| ------ | --------------------------------------------------------------------------- |
| 🟢 Verde    | Off-peak (precio normal con descuento).                                     |
| 🟡 Amarillo | Última hora de off-peak antes de que empiece el pico.                        |
| 🟠 Naranja  | Última hora del pico antes de que empiece el off-peak.                       |
| 🔴 Rojo     | Centro de la franja pico (tarifa 2x).                                        |

## Horarios pico (fuente oficial)

DeepSeek define el pico en **UTC**, de lunes a viernes (el fin de semana completo es off-peak):

- `01:00 - 04:00 UTC`
- `06:00 - 10:00 UTC`

El estado se calcula localmente con la hora UTC del sistema: **no hace llamadas a red**.

## Cómo probar

1. Abre esta carpeta en VS Code.
2. Pulsa `F5` (configuración "Run Extension"). Se abrirá una ventana de Extension Development Host.
3. Mira la barra de estado inferior: verás un bloque de color que indica el estado actual.

## Pruebas de la lógica

```bash
npm test
```

Ejecuta `node test.js` y valida la lógica de los horarios con horas de muestra (entre semana y fin de semana).

## Estructura

- `pricing.js` — lógica pura: `getState(date)` y colores.
- `extension.js` — crea el item de la barra de estado y lo refresca cada 60s.
- `test.js` — verificación de la lógica.

> Nota: `StatusBarItem.backgroundColor` de VS Code solo admite dos colores de tema
> (`errorBackground`/`warningBackground`), por eso el indicador se pinta con un
> carácter de bloque sólido (`█`) usando `StatusBarItem.color`, que acepta cualquier hex.
