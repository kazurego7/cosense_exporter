# Cosense Exporter (Prototype)

このプロジェクトは、Cosense プロジェクトを Markdown + 画像の ZIP
としてエクスポートする Web サービスの簡易プロトタイプです。

## 使い方

1. Deno をインストールします。
2. 下記コマンドでサーバーを起動します。

```bash
deno task start
```

3. `POST /api/preview` または `POST /api/export` に JSON `{ project: "<id>" }`
   を送信します。
   - `/api/preview` はファイルツリーとサンプル HTML を JSON で返します。
   - `/api/export` は ZIP ファイルを返します。

※ 現時点では実データ取得は行わず、スタブレスポンスのみ返します。

## 開発

コードの整形と Lint をまとめて実行する `deno task check` を用意しています。
開発時は次のコマンドでチェックできます。

```bash
deno task check
```

## デプロイ

本リポジトリには Deno Deploy へ自動デプロイする GitHub Actions ワークフロー
`deploy.yml` が含まれています。あらかじめ Deno Deploy
でプロジェクトを作成し、GitHub リポジトリをリンクして取得したトークンを GitHub
の Secrets に `DENO_DEPLOY_ACCESS_TOKEN` として登録してください。
