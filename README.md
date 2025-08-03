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