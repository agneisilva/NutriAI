#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/build"
DIST_DIR="$ROOT_DIR/dist"
ZIP_PATH="$DIST_DIR/lambda.zip"

rm -rf "$BUILD_DIR" "$ZIP_PATH"
mkdir -p "$BUILD_DIR" "$DIST_DIR"

python -m pip install --upgrade pip >/dev/null
python -m pip install \
  --platform manylinux2014_x86_64 \
  --implementation cp \
  --python-version 3.11 \
  --only-binary=:all: \
  --upgrade \
  -r "$ROOT_DIR/requirements.txt" \
  -t "$BUILD_DIR" >/dev/null

cp -R "$ROOT_DIR/src/app" "$BUILD_DIR/app"
cp "$ROOT_DIR/src/lambda_handler.py" "$BUILD_DIR/lambda_handler.py"

(
  cd "$BUILD_DIR"
  python -m zipfile -c "$ZIP_PATH" ./*
)

echo "✅ Lambda zip gerado em: $ZIP_PATH"
