#!/bin/bash
PLUGIN_NAME="fretboard-explorer"
ZIP_NAME="${PLUGIN_NAME}.zip"
rm -f "$ZIP_NAME"
zip -r "$ZIP_NAME" . -x "node_modules/*" -x ".kilocode/node_modules/*" -x ".git/*" -x ".gitignore" -x "*.log" -x ".DS_Store" -x "$ZIP_NAME" -x "zip.sh"
echo "Created $ZIP_NAME"
unzip -l "$ZIP_NAME" | tail -5