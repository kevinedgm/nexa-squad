#!/usr/bin/env bash
# Instalador (ruta git clone). Envoltorio de bin/install.mjs para tener una sola fuente. Requiere Node >= 16.
#   ./install.sh install --target claude [--global] [--dest <dir>] [--only <roles>] [--force] [--dry-run]
#   ./install.sh update  --target kiro --dry-run   (qué cambiaría al actualizar)
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: se necesita Node.js (>=16) para el instalador." >&2; exit 1
fi
if [[ $# -eq 0 || "${1:-}" == --* ]]; then exec node "$DIR/bin/install.mjs" install "$@"; else exec node "$DIR/bin/install.mjs" "$@"; fi
