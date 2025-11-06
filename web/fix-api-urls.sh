#!/bin/bash

# Find all tsx/ts files with hardcoded URLs and create a list
find . -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
  if grep -q "http://localhost:3333\|192.168" "$file"; then
    echo "$file"
  fi
done > api-files.txt

echo "Files needing update:"
cat api-files.txt
echo ""
echo "Total files: $(wc -l < api-files.txt)"
