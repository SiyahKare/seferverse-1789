# 📜 CHANGELOG

> Bu dosya, SeferVerse dApp ve ekosisteminin tüm önemli teknik gelişmelerini, refactor ve değişiklikleri kaydeder.
> Her “Sprint”, büyük değişiklik ve milestone burada net listelenir.  
> En yeni üstte, eski alta.

---

## [v0.7.0] - 2025-08-03
### Added
- Smart deploy pipeline V7: arg parser, verify, deployments.json/log, .env sync, debug logging
- SeferVerseDAO.sol contract production deploy + Base Sepolia verified
- deployments.log auto-append feature

### Changed
- .env değişken isimleri full upper-case contract bazlı hale getirildi (`SEFERVERSEDAO_ARGS`, vs.)
- Log formatı JSON & human-readable text olarak ayrıldı

---

## [v0.6.0] - 2025-08-02
### Added
- Full auto-update deploy pipeline (deployAndVerify.js v6)
- CLI deploy, verify, .env ve deployments.json otomasyonu
- Debug: Env parser upgrade, tırnak ve boşluk toleransı eklendi

### Changed
- deployAndVerify script arg/param yönetimi refactor edildi
- Tek tık testnet/mainnet deploy flow

---

## [v0.5.0] - 2025-08-01
### Added
- SeferVerseDAO v1 contract (constructor: name, owner, event logs)
- Base Sepolia pipeline: deploy, verify, log
- .env ve deployments.json temelleri

---

## [v0.0.1] - 2025-07-30
### Added
- Monorepo & temel klasör yapısı
- README ve .env.example
- İlk Hardhat ve Next.js app setup

---
