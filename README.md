# Cosense Exporter (Prototype)

このプロジェクトは、Cosense プロジェクトを Markdown + 画像の ZIP
としてエクスポートする Web サービスの簡易プロトタイプです。

## セットアップ

環境を自動で整えるスクリプト `setup.sh` を用意しています。 Deno
が入っていない環境では次のコマンドでインストールされ、PATH は自動で `~/.bashrc`
に追記されます。

> **Note:** Vercel の Edge Runtime は Deno 1.44 系を使用しているため、
> `setup.sh` では Deno 1.44.x を自動でインストールします。依存関係を更新する際も
> Deno 1.44.x を利用してください。

```bash
./setup.sh
```

## 使い方

1. 必要であれば `./setup.sh` を実行して Deno をインストールします。
2. `next-app` ディレクトリでフロントエンドをビルドします。

```bash
cd next-app
npm install
npm run build
cd ..
```

3. 下記コマンドでサーバーを起動します。

```bash
deno task start
(内部で `--allow-net` と `--allow-env` を付与しています)
```

4. ブラウザで `http://localhost:8000/` にアクセスすると、プロジェクト ID と sid
   を入力するフォームが表示されます。プレビューボタンで `/api/preview` を、
   エクスポートボタンで `/api/export` を呼び出します。
   - `/api/preview` はファイルツリーとサンプル HTML を JSON で返します。
   - `/api/export` は ZIP ファイルを返します。

### `/api/preview` のレスポンス仕様

```jsonc
{
  "fileTree": [
    {
      "path": "README.md",
      "type": "file",
      "size": 120
    },
    {
      "path": "docs/",
      "type": "dir"
    }
  ],
  "sampleHtml": "<pre>...</pre>"
}
```

`fileTree` は各ファイル・ディレクトリのパスと種別、ファイルの場合はサイズ
（バイト）を含む配列です。`sampleHtml` には README.md の内容を HTML 化した
プレビューが入ります。

※ 現時点では実データ取得は行わず、スタブレスポンスのみ返します。

## 開発

コードの整形と Lint をまとめて実行する `deno task check` を用意しています。
開発時は次のコマンドでチェックできます。

```bash
deno task check
```

## デプロイ (Vercel)

Vercel へ自動デプロイする GitHub Actions ワークフロー `deploy.yml`
を用意しています。 あらかじめ Vercel でプロジェクトを作成し、Secrets に
`VERCEL_TOKEN`、 `VERCEL_ORG_ID`、`VERCEL_PROJECT_ID` を登録してください。

push すると Preview URL が発行され、`--prod` オプションを指定すると本番環境へ
デプロイできます。

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
