# 🗺️ SeferVerse dApp Roadmap

> Bu dosya, bütün sprint planlarını, iş sıralamasını ve tahmini zamanlamayı listeler.
> Her aşama sonunda "DONE" veya "IN PROGRESS" etiketiyle kolayca güncellenir.

---

## SPRINT 0: Proje Setup & Monorepo [DONE]
- Klasör yapısı
- Temel .env.example ve README
- Git repo ve ilk commit

---

## SPRINT 1: Blockchain Pipeline & Testnet Deploy [DONE]
- SeferVerseDAO.sol v1 (name, owner, events)
- deployAndVerify.js (V7) otomasyon scripti
- deployments.json, deployments.log, .env auto update
- Base Sepolia deploy ve explorer verify

---

## SPRINT 2: Backend / API Layer [IN PROGRESS]
- Express.js backend: `/deployments` endpoint (serve deployments.json)
- API healthcheck, CORS, prod readiness
- Otomatik testler ve dummy endpoint
- (Opsiyonel: Next.js API routes alternatifi)
- **Tahmini Süre:** 0.5 gün

---

## SPRINT 3: Frontend / dApp Auto Loader [TO DO]
- Next.js setup (`npx create-next-app seferverse-dapp`)
- Tailwind CSS, Wagmi, Ethers, dotenv integration
- `/lib/useSeferVerse.js` auto-loader hook (API’dan contract/ABI çekme)
- İlk basic UI: contract address, name, owner gösterimi
- Wallet connect entegrasyonu
- **Tahmini Süre:** 1 gün

---

## SPRINT 4: Frontend Enhancement & Showcase [TO DO]
- Şık landing page, gradient animasyon, responsive tasarım
- Tüm contract fonksiyonları için UI, event listener
- Gas/stat tracker, explorer link
- **Tahmini Süre:** 1 gün

---

## SPRINT 5: Prod Deploy & Public Demo [TO DO]
- Frontend: Vercel/Netlify deploy
- Backend: Railway/Render/S3
- deployments.json CDN’den sunulacak şekilde otomasyon
- Quick start guide ve demo içeriği
- **Tahmini Süre:** 0.5 gün

---

## Ekstra Sprintler (Opsiyonel/Show)
- Telegram MiniApp backend
- Upgradeable proxy & token/NFT modülleri
- Analytics dashboard, usage stats

---

> **GÜNCEL DURUM:**  
> Sprint 2'ye başlıyoruz! Backend API dosyaları az sonra drop edilecek.

