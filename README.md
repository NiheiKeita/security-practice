# Security Practice Arcade

ローカルまたは閉じた検証環境で、脆弱な設計と修正版の差分を比較しながら学ぶための Laravel + Inertia 製教材です。

## セットアップ

アプリ本体は `src` 配下です。

```bash
cd src
composer install
npm install
php artisan migrate:fresh --seed
php artisan serve
```

別ターミナルでフロント開発サーバーを使う場合:

```bash
cd src
npm run dev
```

本実装では `src/.env` と `src/database/database.sqlite` を用意済みなので、上記の `migrate:fresh --seed` で教材データを再投入できます。

## デモアカウント

- `aiko@example.local` / `password`
- `kenji@example.local` / `password`
- `rina@example.local` / `password`
- `sora@example.local` / `password`
- `mentor@example.local` / `password` (`admin`)

## 画面

- トップページ
- ログイン
- ステージ一覧
- ステージ詳細
- ランキング
- 教材用管理画面

## 学習ステージ

- Stage 1: クライアント値を信用したスコア保存
- Stage 2: 他人のスコアを書き換えられる認可不備
- Stage 3: 管理画面の権限不備
- Stage 4: ランキング表示での危険な出力
- Stage 5: CSRF 的な勝手な状態変更
- Stage 6: API の過剰なレスポンス

## 補足

- 学習目的のローカルサンプルです。実在の個人情報や秘密情報は入れないでください。
- 危険な外部副作用は持たせていません。
- 脆弱版は教材用の再現であり、公開運用を想定した実装ではありません。

## ドキュメント

- 練習ガイド: [docs/practice-guide.md](/Users/niheikeita/develop/security-practice/docs/practice-guide.md)
- Docs index: [docs/index.md](/Users/niheikeita/develop/security-practice/docs/index.md)
- GitHub Pages 想定 URL: `https://niheikeita.github.io/security-practice/`
