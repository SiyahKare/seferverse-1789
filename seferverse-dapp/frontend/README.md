## SeferVerse dApp Frontend

Next.js (Pages Router) tabanlı dApp arayüzü. Backend’den `/deployments` verisini çekerek kontrat deploylarını listeler.

### Çalıştırma

```bash
cd seferverse-dapp/frontend
npm i
npm run dev
```

Tarayıcıdan `http://localhost:3000` adresine gidin.

### Ortam Değişkenleri

`NEXT_PUBLIC_EXPLORER_BASE` (opsiyonel): Explorer tabanı. Ayarlanırsa tüm tx/adres linkleri bu tabana göre üretilir.

Örnek `.env.local`:

```env
NEXT_PUBLIC_EXPLORER_BASE=https://sepolia.basescan.org
```

### Veri Kaynağı

Backend varsayılanı `http://localhost:8000/deployments`. `lib/api.ts` gelen JSON’u normalize eder, UI’da `utils/format.ts` tarih/gas/explorer URL formatları uygulanır.

### Komponentler

- `components/DeploymentCard.tsx`, `components/DeploymentTable.tsx`, `components/ContractCard.tsx`: Explorer linkleri için `getExplorerTxUrl` ve `getExplorerAddressUrl` kullanır.

