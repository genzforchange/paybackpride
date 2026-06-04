#!/bin/bash
set -e

# Static site (HTML/CSS/JS) served by `python3 -m http.server`.
# No dependencies, migrations, or build step are required.
echo "Post-merge: static site, nothing to install or build."
