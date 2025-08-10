#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/../.." && pwd)
INFRA_DIR="$ROOT_DIR/infra"

echo "[+] SeferVerse deploy starting (infra: $INFRA_DIR)"

if ! command -v docker >/dev/null 2>&1; then
  echo "[+] Installing docker..."
  sudo apt-get update -y
  sudo apt-get install -y ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  sudo usermod -aG docker "$USER" || true
  echo "[+] Docker installed. You may need to re-login for group changes to apply."
fi

# Fix Docker permissions for current session
echo "[+] Fixing Docker permissions..."
sudo chmod 666 /var/run/docker.sock
newgrp docker << EONG
echo "[+] Docker group activated for current session"
EONG

cd "$INFRA_DIR"

echo "[+] Using docker compose file: $(pwd)/docker-compose.yml"
echo "[i] Expecting env (optional): STREAM_TOKEN, ALLOWED_ORIGINS, NEXT_PUBLIC_EXPLORER_BASE, PRIVATE_KEY, BASESCAN_API_KEY"

docker compose pull || true
docker compose up -d

echo "[+] Services started"
echo " Frontend:  http://$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo "<EC2_IP>")/"
echo " Backend:   http://$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo "<EC2_IP>")/api/health"
echo " SSE:       http://$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo "<EC2_IP>")/api/deployments/stream"
echo "[✓] Done"
