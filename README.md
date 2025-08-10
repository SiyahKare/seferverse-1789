# 🌌 SeferVerse 1789 – Baron Devrimi

> **Web3 + NFT + Token + Müzik + Tribe = Global Kültür Devrimi**  
> Rugcılardan tahsilat, hayallerin refund'u ve kültürel adalet!
> **by: Onur Mutlu & Taylan Transport Kft.** (ve bir grup asi hayalperest)

---

## 🚀 Proje Hakkında

**SeferVerse 1789**, sadece bir blockchain projesi değil;  
**global bir kültür, müzik ve NFT devrimi.**

- **Token & NFT:** Base L2 üzerinde **BaronToken (BRT)** ve **Baron Trilogy Audio NFT**
- **MiniApp & dApp:** Tribe için hızlı erişim ve mint/refund ekranları
- **Actor.Coach entegrasyonu:** Hayalini kanıtla → Refund → Kültür Coin
- **Global hedef:** **1789 ETH Hard Cap**
- **Slogan:** *“Hayalini anlat, hakkını al – Rugcıdan tahsilat, barona iade!”*

---

## 🏗 Monorepo Yapısı

```

seferverse-1789/
├── seferverse-blockchain/   # Token, NFT, Refund kontratları
│   ├── token/               # ERC20 – BaronToken
│   ├── nft/                 # ERC721A – BaronNFT
│   ├── refund/              # Refund & airdrop kontratları
│   └── scripts/             # Deploy ve verify scriptleri
│
├── seferverse-dapp/         # Web dApp + Backend + Telegram MiniApp
│   ├── frontend/            # Next.js/React dApp
│   ├── backend/             # FastAPI / Node.js backend
│   └── miniapp/             # Telegram WebApp (Mint & Refund)
│
├── mobile/                  # Opsiyonel: React Native / Flutter
└── infra/                   # Docker, CI/CD, Nginx ve deploy scriptleri

````

---

## ⚡ Başlangıç Adımları

### 1️⃣ Repo Kopyala & Aç

```bash
git clone <repo-url>
cd seferverse-1789
code .
````

### 2️⃣ Blockchain Setup (Hardhat)

```bash
cd seferverse-blockchain
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat compile
```

### 3️⃣ Web dApp & MiniApp Setup

```bash
cd seferverse-dapp/frontend
npm install
npm run dev
```

### 4️⃣ Backend Setup (FastAPI)

```bash
cd seferverse-dapp/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🧪 Test, CI ve Docker Orkestrasyonu

- Frontend test: `cd seferverse-dapp/frontend && npm run test`
- Backend test: `cd seferverse-dapp/backend && python -m venv .venv && source .venv/bin/activate && pytest`
- CI: `.github/workflows/ci.yml` backend (pytest), frontend (lint/test/build) ve Hardhat compile’ı koşar.

### Docker ile Çalıştırma (Tek Komut)

- Uygulama (backend + frontend):
  - `make up` veya `cd infra && docker compose up -d`
- Uygulama + Yerel Hardhat node + Otomatik deploy:
  - `make up-deploy` veya `cd infra && docker compose --profile deploy up -d`

Servisler:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000/health`
- Hardhat RPC: `http://localhost:8545`
 - Nginx (reverse proxy): `http://localhost/` (frontend) ve `/api/*` (backend)

Ortam değişkenleri:
- Frontend: `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_EXPLORER_BASE`
- Backend: `DEPLOYMENTS_PATH` (compose’da otomatik set)
- Blockchain: `PRIVATE_KEY`, `BASESCAN_API_KEY` (testnet/mainnet deploy için)
 - Canlı akış güvenlik (opsiyonel): `STREAM_TOKEN`, `ALLOWED_ORIGINS`

### Makefile Kısayolları
- `make up`, `make up-deploy`, `make down`
- `make logs` (tümü) / `make backend-logs` / `make frontend-logs` / `make hh-logs`
- `make deploy-local` (localhost ağına manuel deploy)

---

## 🔴 SSE (Server-Sent Events) – Canlı Akış
---

## 🚀 Prod Deploy – EC2 + Cloudflare

1) GitHub Secrets (Repo → Settings → Secrets):
- `EC2_HOST` (örn. 3.XX.XX.XX)
- `EC2_USER` (örn. ubuntu)
- `EC2_SSH_KEY` (EC2 .pem içeriği)
- `STREAM_TOKEN` (SSE token)
- `ALLOWED_ORIGINS= https://seferverse1789.siyahkare.com`
- `NEXT_PUBLIC_EXPLORER_BASE= https://sepolia.basescan.org`
- (opsiyonel) `DEPLOY_PRIVATE_KEY`, `BASESCAN_API_KEY`

2) Cloudflare:
- `seferverse1789.siyahkare.com` A kaydı → EC2 Public IP
- Proxy açık, SSL Full (Strict)

3) EC2’de otomatik deploy:
- main’e push → `.github/workflows/deploy-ec2.yml` çalışır
- EC2’ye SSH, repo güncelle, `infra/scripts/deploy.sh`
- Erişim: `https://seferverse1789.siyahkare.com/`

4) Manuel deploy (opsiyonel):
```bash
ssh ubuntu@<EC2_IP>
git clone https://github.com/<owner>/<repo>.git /opt/seferverse-1789
cd /opt/seferverse-1789/infra/scripts && ./deploy.sh
```


- Endpoint: `GET /deployments/stream`
- İçerik: İlk bağlantıda `type=full` snapshot; daha sonra `type=added|updated|removed|noop` event’leri.
- Keep-alive: Periyodik `: ping` satırları ve `retry: 3000` ile yeniden bağlanma süresi tavsiyesi.
- Güvenlik (opsiyonel):
  - Token: `STREAM_TOKEN` (backend env). Frontend `NEXT_PUBLIC_STREAM_TOKEN` ile query param’da gönderir.
  - Origin: `ALLOWED_ORIGINS` (virgülle ayrık; ör: `http://localhost:3000,https://app.example.com`).
- Frontend entegrasyonu: `connectDeploymentsSSE(onData)`; diff’ler incremental işlenir, grid otomatik güncellenir.


## 🏁 **Sprint 1: Blockchain Pipeline Başarıyla Tamamlandı!**

* **Hardhat deploy pipeline**: arg parser, verify, deployments.json/log, .env sync, debug logging (V7)
* **SeferVerseDAO.sol**: testnet (Base Sepolia) verified deploy
* **Otomasyon**: Tüm env, log ve JSON dosyaları tek script ile güncelleniyor
* **Hazır**: Bir sonraki adımda backend ve frontend otomatik kontrat sync başlayacak

---

## 🎯 Yol Haritası (CTO Perspektifi)

1. **Token Deploy (BaronToken ERC20)**
2. **NFT Deploy (Baron Trilogy Audio NFT)**
3. **Web dApp + MiniApp → WalletConnect & Mint**
4. **Refund Mekanizması & Actor.Coach entegrasyonu**
5. **Soft/Mid/Hard Cap milestone’ları & global lansman**
6. **VR Concert + NFT Wave 3 + 1789 ETH hard cap**

> Detaylı roadmap için: [ROADMAP.md](./ROADMAP.md)
> Tüm teknik değişiklikler için: [CHANGELOG.md](./CHANGELOG.md)

---

## 🛡 Güvenlik & Şeffaflık

* **MultiSig cüzdan** → Tahsilat & refund fonu
* **On-chain hash** → Actor.Coach performans kanıtı
* **Base L2** → Düşük gas + global erişim

---

## 👑 Kurucular & Ekip

* **Onur Mutlu** – CTO & Blockchain Architect
* **Taylan Transport Kft.** – Tribe Leader & Vision
* **NeParca** – Global Label & Prodüksiyon

---

### 🌍 Sloganlar

* **“Hayalini anlat, hakkını al.”**
* **“Rugcıdan tahsilat, barona iade.”**
* **“1789 ETH → Global Baron Devrimi!”**

---

### 🦾 Notlar & Mizah

* **Not:** Bu repo bir hayalin, bir devrimin ve biraz da deliliğin ürünüdür.
* **Lütfen:** Rug yapmayın, hayal çalmayın, refund isteyene küfür etmeyin.
* **Unutma:** Push'lamadan önce .env ve özel anahtarlarını public etme; Baron seni izliyor olabilir.

---

### 🏁 Sprint 2 Backend Checklist

- [ ] `/health` endpoint hazır
- [ ] `/deployments` endpoint JSON döndürüyor
- [ ] `.env.example` ve log sistemi hazır
- [ ] Docker build & run successful
- [ ] Commit & push → Sprint 2 backend ready
