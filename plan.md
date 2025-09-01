## 機能要件

- 4つの正方形画像を1つの画像に結合して、ダウンロードする
- ドラッグ&ドロップ
- 2×2グリッドレイアウトのみ

## 実装詳細

- 技術スタック
  - Vanilla HTML/CSS/JavaScript（依存関係なし）
  - HTML5 Canvas API for 画像処理
  - File API & Drag and Drop API
- docs/index.html
  - HTML5構造でドラッグ&ドロップ対応のWebアプリケーション
  - 4つのドロップゾーン（2×2グリッド）
  - 結合画像の表示エリア
  - ダウンロードボタン
- docs/style.css
  - ドラッグオーバー時の視覚的フィードバック
  - モダンでクリーンなUI
- docs/script.js
  - ファイルドラッグ&ドロップハンドリング
  - 画像の正方形チェック
  - HTML5 Canvasを使用した画像結合処理
  - 結合画像のダウンロード機能
