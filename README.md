# camera-voice-memo

スマホのブラウザからカメラと声で簡単なメモを取る PWA。仕様は [CLAUDE.md](./CLAUDE.md) を参照。

## 開発

```sh
npm install
npm run dev      # カメラ/マイクは localhost か HTTPS でのみ動作
npm run build
npm run lint
```

## GitHub Pages へのデプロイ

1. GitHub の Settings → Pages → Source を **GitHub Actions** に設定
2. `main` に push すると `.github/workflows/deploy.yml` が `dist/` を公開する

`vite.config.ts` は `base: './'` のため、リポジトリ名が変わっても動作する。
