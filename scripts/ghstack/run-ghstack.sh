#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
uv run --python 3.11 "$SCRIPT_DIR/run_ghstack.py" "$@"
