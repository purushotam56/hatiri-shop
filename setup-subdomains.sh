#!/bin/bash
# Quick setup script for testing subdomains locally
# Run this to add subdomain entries to /etc/hosts

HOSTS_FILE="/etc/hosts"
ENTRY_MARKER="# Hatiri Shop Subdomains"

# Check if entries already exist
if grep -q "$ENTRY_MARKER" "$HOSTS_FILE"; then
    echo "✓ Subdomain entries already in $HOSTS_FILE"
    exit 0
fi

# Backup hosts file
sudo cp "$HOSTS_FILE" "$HOSTS_FILE.backup.$(date +%s)"
echo "✓ Backed up $HOSTS_FILE"

# Add subdomain entries
sudo tee -a "$HOSTS_FILE" > /dev/null <<EOF

$ENTRY_MARKER
127.0.0.1 hatiri.localhost
127.0.0.1 shop1.hatiri.localhost
127.0.0.1 fm001.hatiri.localhost
127.0.0.1 qs001.hatiri.localhost
127.0.0.1 de001.hatiri.localhost
EOF

echo "✓ Added subdomain entries to $HOSTS_FILE"
echo ""
echo "You can now access:"
echo "  - Home: http://shop1.hatiri.localhost:3000/"
echo "  - Fresh Mart: http://fm001.hatiri.localhost:3000/"
echo "  - Quick Supplies: http://qs001.hatiri.localhost:3000/"
echo "  - Daily Essentials: http://de001.hatiri.localhost:3000/"
