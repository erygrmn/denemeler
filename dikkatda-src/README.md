# DikkatDA site kaynağı

`dikkatda/` klasöründeki tüm HTML sayfaları bu klasördeki betiklerle üretilir.
**HTML dosyalarını elle düzenlemeyin**; bir sonraki derlemede üzerine yazılır.

## Derleme

```
node dikkatda-src/build.js
```

## Dosyalar

| Dosya | İçerik |
|---|---|
| `layout.js` | İkonlar, hizmet/çözüm/sektör/araç verileri, mega menüler, header/footer, ana sayfa |
| `content.js` | Sayfa metinleri: çözüm ve sektör açıklamaları, SSS, blog yazıları, sözlük, kariyer, referanslar, araç tanımları |
| `build.js` | Sayfa şablonları ve çıktı (sitemap.xml, robots.txt dahil) |

CSS ve JS doğrudan `dikkatda/assets/` altında düzenlenir (`style.css`, `pages.css`, `main.js`, `tools.js`).

## Yayın öncesi yapılacaklar

- `dikkatda/assets/js/main.js` → `FORM_ENDPOINT`: formların gönderileceği servis (şu an yalnızca başarı mesajı gösterir).
- `dikkatda/assets/js/tools.js` → `PSI_API_KEY`: Google PageSpeed API anahtarı (anahtarsız istekler 429 kota hatası verir).
- `content.js` içindeki referans, vaka çalışması ve yasal metinler şablondur; gerçek bilgilerle güncelleyin.
- Telefon, adres ve e-posta bilgileri `layout.js` ve `build.js` içinde.
