# Cosense Exporter (Prototype)

このプロジェクトは、Cosense プロジェクトを Markdown + 画像の ZIP
としてエクスポートする Web サービスの簡易プロトタイプです。

## セットアップ

環境を自動で整えるスクリプト `setup.sh` を用意しています。 Deno
が入っていない環境では次のコマンドでインストールされ、PATH は自動で `~/.bashrc`
に追記されます。

```bash
./setup.sh
```

## 使い方

1. 必要であれば `./setup.sh` を実行して Deno をインストールします。
2. 下記コマンドでサーバーを起動します。

```bash
deno task start
(内部で `--allow-net` と `--allow-env` を付与しています)
```

3. ブラウザで `http://localhost:8000/` にアクセスすると、プロジェクト ID と sid
   を入力するフォームが表示されます。プレビューボタンで `/api/preview` を、
   エクスポートボタンで `/api/export` を呼び出します。
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

手動デプロイ用に `deno task deploy` も用意しました。事前に `deployctl`
をインストールし、環境変数 `DENO_DEPLOY_ACCESS_TOKEN`
を設定して実行してください。 また、GitHub Actions のワークフローは
`workflow_dispatch` にも対応しているため、 リポジトリの Actions
タブから手動で実行することも可能です。

## KV 履歴レコードスキーマ

エクスポート履歴は Deno KV に保存されます。キーと値の構造は次の通りです。

| Key パターン  | 値                                         | TTL  |
| ------------- | ------------------------------------------ | ---- |
| `hist:{uuid}` | `{ id, project, status, size, createdAt }` | 30日 |

各フィールドの概要:

- `id`: 履歴レコードの UUID (キーにも含まれる)
- `project`: 対象プロジェクトの ID
- `status`: エクスポート処理の状態
- `size`: 生成された ZIP のサイズ (bytes)
- `createdAt`: レコード登録日時
