# Cosense Exporter

Scrapbox プロジェクトを Markdown + 画像の ZIP として取得する Web アプリです。

## 必要環境

- Node.js 20.x
- npm
- Vercel CLI (`npx vercel`)

Node.js のバージョンは `.nvmrc` と `package.json` の `engines` セクションに合わせてください。
`nvm` を利用している場合は `nvm use` で自動的に切り替えられます。

## セットアップ

```bash
nvm install   # 初回のみ
nvm use
npm install
npm --prefix next-app install
```

## ビルド

Next.js アプリと API をまとめてビルドするには以下を実行します。

```bash
npx vercel build
```

## ローカル開発

本番と同じビルド手順で起動するため、Vercel CLI を利用します。

```bash
npx vercel dev
```

## デプロイ

Vercel プロジェクトに紐づいていれば、次のコマンドでデプロイできます。

```bash
vercel deploy --prod
```

## E2E テスト

Playwright を利用したエンドツーエンドテストを `tests/` ディレクトリに配置しています。
ブラウザをインストールした上で次のコマンドを実行してください。

```bash
npm --prefix next-app install
npx playwright install
npx playwright test
```

テスト実行時には `npm run dev` が自動で起動し、`http://localhost:3000` でアプリが提供されます。

