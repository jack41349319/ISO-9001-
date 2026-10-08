# Supabase Auth 設定

這個靜態網站已加入 Supabase 電子郵件／密碼登入、註冊、登出與受保護內容。

## 1. 填入專案設定

到 Supabase Dashboard 的 **Project Settings > API**，將：

- `Project URL`
- `Publishable key`

填入 `supabase-config.js` 的 `url` 與 `publishableKey`。只能使用 publishable key，不要放入 `service_role` 或 secret key。

## 2. 設定登入確認網址

在 **Authentication > URL Configuration** 將網站的正式網址加入 **Site URL** 與 **Redirect URLs**。本地測試可加入實際使用的網址，例如 `http://localhost:8000`。

## 3. 啟動本地網站

請透過 HTTP server 開啟，不要直接雙擊 `index.html`：

```powershell
python -m http.server 8000 --directory 網站
```

再開啟 `http://localhost:8000`。

## 保護範圍

目前是靜態網站，因此保護的是瀏覽器顯示與前端操作；任何真正的資料表仍必須在 Supabase 啟用 RLS，並用 `auth.uid()` 限制資料存取。若要做到伺服器端 route guard，請把網站遷移到 Next.js、SvelteKit 或其他 SSR/server framework，再使用 `@supabase/ssr` 的 cookie-based session。
