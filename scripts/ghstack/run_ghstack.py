#!/usr/bin/env python3
"""Wrapper to run vendored ghstack."""
from __future__ import annotations

import runpy
import sys
from pathlib import Path

VENDOR_PATH = Path(__file__).resolve().parents[1] / "vendor" / "python"


def main() -> None:
    sys.path.insert(0, str(VENDOR_PATH))
    runpy.run_module("ghstack.__main__", run_name="__main__")


if __name__ == "__main__":
    main()
