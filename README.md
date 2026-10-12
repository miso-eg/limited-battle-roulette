# 限定バトル ルール抽選

TikTok LIVEの限定バトルで使用するルールをカテゴリ別に抽選するアプリです。
Next.jsの静的エクスポートを使用し、GitHub Pagesでサーバーなしで動作します。

## GitHub Pagesで公開する

1. この変更を `main` にマージします。
2. **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定します。
3. **Actions → Deploy to GitHub Pages → Run workflow** を実行します。以降は `main` へのpushで自動公開されます。

公開先: https://miso-eg.github.io/limited-battle-roulette/

PRではlintと静的ビルドのみ実行します。
ルール一覧は `/limited-battle-roulette/rules/` で直接アクセス・再読み込みできます。

## ローカル開発

Node.js 22以降を使用してください。

```sh
npm ci
npm run dev
```

http://localhost:3000/ を開きます。Windowsでは `start.bat` でも起動できます。

## 静的ビルド

```sh
npm run lint
npm run build
```

`out/` にHTML・CSS・JavaScriptが出力されます。静的HTTPサーバーで配信してください。
`next start` は静的エクスポートでは使用できません。

Pagesと同じパスでビルドする場合（PowerShell）:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/limited-battle-roulette'
npm run build
Remove-Item Env:NEXT_PUBLIC_BASE_PATH
```

`NEXT_PUBLIC_BASE_PATH` はビルド時に埋め込まれます。別のリポジトリ名や独自ドメインで公開する場合は、
`.github/workflows/pages.yml` の値を公開先に合わせて変更してください。ドメイン直下なら空文字にします。

## ルールの更新

`public/rules.csv` を編集して `main` にpushすると再ビルド・公開されます。
既存ファイルと同じShift_JIS、列順 `id,category,title,description` を維持してください。
カテゴリは「人縛り」「コイン縛り」「ギフト縛り」です。項目にカンマや改行を含めないでください。
