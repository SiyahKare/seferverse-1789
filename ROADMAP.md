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
- FastAPI backend: `/deployments` endpoint (serve deployments.json)
- API healthcheck, CORS, prod readiness
- Otomatik testler ve dummy endpoint
- (Opsiyonel: Next.js API routes alternatifi)
- **Tahmini Süre:** 0.5 gün

---

## SPRINT 3: Frontend / dApp Auto Loader [TO DO]
- Next.js setup (`npx create-next-app seferverse-dapp`)
- Tailwind CSS, Wagmi, Ethers, dotenv integration
- `/lib/api.ts` normalize + ortak `utils/format.ts` ile explorer/tarih/gas
- İlk UI: deployment kartları/tablo + kopyalama + explorer linkleri
- Wallet connect entegrasyonu
- **Tahmini Süre:** 1 gün

---

## SPRINT 4: Frontend Enhancement & Showcase [IN PROGRESS]
- Şık landing page, gradient animasyon, responsive tasarım
- Tüm contract fonksiyonları için UI, event listener
- Frontend Dockerfile + compose entegrasyonu
- Env: `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_EXPLORER_BASE`
- Gas/stat tracker, explorer link
- **Tahmini Süre:** 1 gün

---

## SPRINT 5: Live Data & Security [IN PROGRESS]
- Backend SSE: `/deployments/stream` full + diff event akışı
- Güvenlik: `STREAM_TOKEN`, `ALLOWED_ORIGINS` ve frontend token paramı
- Frontend: SSE canlı güncelleme, bağlantı göstergesi, incremental diff işleme
- **Tahmini Süre:** 0.5 gün

---

## SPRINT 6: Prod Deploy & Public Demo [TO DO]
- Frontend: Vercel/Netlify deploy
- Backend: Railway/Render/S3
- deployments.json CDN’den sunulacak şekilde otomasyon
- CI: Backend pytest, Frontend lint/test/build, Hardhat compile
- Quick start guide ve demo içeriği
- **Tahmini Süre:** 0.5 gün

---

## Ekstra Sprintler (Opsiyonel/Show)
- Telegram MiniApp backend
- Upgradeable proxy & token/NFT modülleri
- Analytics dashboard, usage stats
- Live reload/refresh: deployments.json değişiminde frontend auto-refresh

---

> **GÜNCEL DURUM:**  
> Sprint 2'ye başlıyoruz! Backend API dosyaları az sonra drop edilecek.

