# 🚀 SeferVerse Frontend Development

## Kurulum ve Başlangıç

### 1. Bağımlılıkları Yükle
```bash
cd seferverse-dapp/frontend
npm install
```

### 2. Environment Dosyasını Oluştur
```bash
cp env.example .env.local
```

### 3. WalletConnect Project ID Ayarla
1. [WalletConnect Cloud](https://cloud.walletconnect.com) hesabı oluştur
2. Yeni proje oluştur
3. Project ID'yi `.env.local` dosyasına ekle:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

### 4. Geliştirme Sunucusunu Başlat
```bash
npm run dev
```

Frontend: http://localhost:3000 adresinde açılacak

## 🔧 Özellikler

### ✅ Tamamlanan
- **WalletConnect Entegrasyonu**: Modern Web3Modal ile cüzdan bağlantısı
- **Kontrat Etkileşimi**: SeferVerseDAO ve BaronToken kontratları
- **NFT Minting**: Baron Trilogy Audio NFT mint etme
- **Modern UI**: Glassmorphism tasarım, gradients, animasyonlar
- **Real-time Updates**: SSE ile canlı veri güncellemeleri
- **Responsive Design**: Mobil uyumlu tasarım

### 📋 Kontrat Fonksiyonları
- DAO adı okuma/güncelleme
- Token total supply ve bakiye görüntüleme
- Token transfer işlemleri
- NFT mint etme ve bakiye görüntüleme

### 🎨 UI Bileşenleri
- `WalletConnect`: Cüzdan bağlantı butonu
- `ContractInteraction`: DAO ve Token etkileşimleri
- `NFTMinting`: NFT mint etme arayüzü
- `DeploymentCard`: Kontrat deployment bilgileri

## 🛠 Geliştirme Notları

### Kontrat Adresleri
Kontrat adresleri `deployments.json` dosyasından otomatik olarak alınır veya environment değişkenlerinden:
- `NEXT_PUBLIC_SEFER_VERSE_DAO_ADDRESS`
- `NEXT_PUBLIC_BARON_TOKEN_ADDRESS`
- `NEXT_PUBLIC_BARON_NFT_ADDRESS`

### Ağ Konfigürasyonu
Desteklenen ağlar:
- Base Mainnet
- Base Sepolia (Test)

### Test ve Build
```bash
# Testleri çalıştır
npm run test

# Prod build
npm run build

# Prod server
npm run start
```

## 🔗 Bağlantılar
- Backend API: http://localhost:8000
- Blockchain RPC: http://localhost:8545 (local)
- Explorer: https://sepolia.basescan.org (Base Sepolia)
