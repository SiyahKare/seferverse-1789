# 🚧 TODO – SeferVerse dApp

> Ekstra blockchain scriptleri ve ileri seviye upgrade işlemleri için geliştirme görevleri, 
> Sprint 6 ve sonrası için backlog ve öncelikli iş listesi.  
> Not: Sıradan “unuttum-gitti” dosyası değil, her task gerçekten production’a katkı sağlar!

---

## [BLOCKCHAIN SPRINT 6+] – Advanced Scripts & Upgradeable Contracts

### 1. `scripts/interact.js` [PRIORITY: MEDIUM]
- Amaç: CLI’dan kontrat fonksiyonlarını hızlıca çağırabilmek (ör: name değiştir, acil parametre set et, faucet, test).
- Özellikler:
  - Argümanlı fonksiyon çağırma (`node scripts/interact.js setName "Yeni DAO Adı"`)
  - Deployer veya farklı wallet ile çalışabilme (env’den private key çekebilme)
  - Tx hash & event log print

### 2. `scripts/readState.js` [PRIORITY: MEDIUM]
- Amaç: Kontrat state’lerini (ör: name, owner, toplam supply, vs.) terminalde tek tuşla okuyabilmek.
- Özellikler:
  - CLI’dan state getter (`node scripts/readState.js name`)
  - Farklı contract/network seçebilme (env veya parametre)
  - Pretty-print sonuç

### 3. `scripts/upgrade.js` [PRIORITY: HIGH]
- Amaç: Upgradeable (proxy) contract sistemi için yeni implementasyon atama, migration, rollback gibi işlemler.
- Özellikler:
  - OpenZeppelin Proxy integration
  - CLI’dan upgrade komutu (`node scripts/upgrade.js SeferVerseDAO_v2`)
  - Upgrade sonrası otomatik verify & log
  - Env/deployments.json auto-update

### 4. `test/` ve `scripts/testHelpers.js` [PRIORITY: LOW]
- Amaç: Hardhat testleri için yardımcı scriptler ve coverage raporları.
- Özellikler:
  - Mock deploy helper
  - Gas cost analyzer
  - State snapshot/rollback

### 5. README/Docs Update [PRIORITY: ALWAYS]
- Eklenen tüm scriptlerin dokümantasyonunu kısa ve net şekilde README veya /docs altına ekle.

---

## [GENEL NOTLAR]

- Tüm scriptler **nodejs entry** olarak, bağımsız ve terminalden kolayca çağrılır olmalı.
- Private key’ler ve kritik parametreler `.env` üzerinden alınmalı, hardcode asla yapılmamalı.
- Her script logunu `deployments.log`’a append etmeli.
- Proxy upgrade mantığına geçildiğinde, eski kontrat adresleri **archive**’lenmeli.

---

> Bu TODO.md, sprint review’larda ve roadmap update’lerinde güncellenmeli.  
> Ekibe/CTO’ya kolay aktarılan, işlevsel backlog!
