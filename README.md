# thaitone-e7817
タイ語声調テスト用サイト

## How to get started

### 下準備
- Node.jsをインストール
  - URL: `https://nodejs.org/en/`
  - LTS版をダウンロード
  - 画面の指示に従ってNode.jsをインストール
  - インストールできたか確認: `node -v`

- Firebaseを使えるように、Firebase CLIをインストール
```
npm install -g firebase-tools
```
- Firebaseにログインして、プロジェクト一覧を確認
```
firebase login
firebase list
```

### 手順
- 当レポジトリを適当な場所にクローンする
```
git clone https://github.com/kawabata2018/thaitone-e7817.git
```
- ローカルサーバーを立ち上げて実行
```
firebase serve
```
