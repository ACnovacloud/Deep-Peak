'use strict';

const vscode = require('vscode');
const { getState, COLORS } = require('./pricing');

// El estado solo cambia en la hora exacta UTC, así que 60s es más que suficiente.
const REFRESH_INTERVAL_MS = 60 * 1000;

/** @param {vscode.ExtensionContext} context */
function activate(context) {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  function update() {
    const state = getState(new Date());
    // Bloque sólido: al usar un carácter de bloque completo, el item se ve
    // como un fondo de color en la barra de estado.
    statusBarItem.text = '\u2588';
    statusBarItem.color = COLORS[state];
    statusBarItem.show();
  }

  update();

  const timer = setInterval(update, REFRESH_INTERVAL_MS);
  context.subscriptions.push(statusBarItem, { dispose: () => clearInterval(timer) });
}

function deactivate() {}

module.exports = { activate, deactivate };
