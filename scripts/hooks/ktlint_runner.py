import os
import subprocess
import sys


def main() -> int:
    cmd = ["cmd", "/c", "gradlew.bat", "ktlint"] if os.name == "nt" else ["./gradlew", "ktlint"]
    result = subprocess.run(cmd)
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
