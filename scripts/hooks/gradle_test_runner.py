import os
import platform
import subprocess
import sys
from pathlib import Path


def main() -> int:
    repo_root = Path(__file__).resolve().parents[2]
    is_windows = platform.system().lower().startswith("win")
    gradle_cmd = ["gradlew.bat", "test"] if is_windows else ["./gradlew", "test"]
    proc = subprocess.run(
        gradle_cmd,
        cwd=repo_root,
        shell=is_windows,
    )
    return proc.returncode


if __name__ == "__main__":
    sys.exit(main())
