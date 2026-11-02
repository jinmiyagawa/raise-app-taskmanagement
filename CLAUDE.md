# raise-app-taskmanagement — Git運用ルール

## ブランチ戦略

GitHub Flowを採用。`main`ブランチへの直接pushは禁止。
すべての変更はPull Requestを経由すること。

## ブランチ命名規則

`<type>/<issue番号>-<英語の短い説明>`

| type | 用途 |
|------|------|
| `feature/` | 新機能 |
| `fix/` | バグ修正 |
| `docs/` | ドキュメントのみ |
| `refactor/` | リファクタリング |
| `chore/` | ビルド・設定・依存関係 |
| `hotfix/` | mainへの緊急修正 |

例: `feature/12-task-filter-by-status`

## コミットメッセージ規約

Conventional Commits形式（日本語対応）:

```
<type>(<scope>): <日本語サマリー（50文字以内）>

<本文（任意）>

Closes #<issue番号>
```

**type**: `feat` / `fix` / `docs` / `refactor` / `test` / `chore` / `style`
**scope**: `frontend` / `backend` / `db` / `docker` / `api` / `auth` / `task`

- サマリー行は50文字以内
- 末尾にピリオドなし
- 関連Issueは`Closes #n`でフッターに記載

## 開発フロー

1. GitHubでIssueを作成する（機能追加 or バグ報告テンプレートを使用）
2. Issueに対応するブランチを作成する
3. 実装・コミット（commit-msgフックがメッセージ形式を検証）
4. Pull Requestを作成する（PRテンプレートを使用）
5. セルフレビュー後にmainへマージ
6. マージ後ブランチを削除する（Issueは自動クローズ）

## Gitフックのセットアップ

リポジトリクローン後、以下を一度実行する:

```sh
git config core.hooksPath .githooks
```

## ディレクトリ構成

```
raise-app-taskmanagement/
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── feature_request.md
│   │   ├── bug_report.md
│   │   └── config.yml
│   └── workflows/
│       └── ci.yml
├── .githooks/
│   └── commit-msg
├── CLAUDE.md        ← このファイル
├── backend-gradle/
├── frontend/
└── docker-compose.yml
```

## GitHubブランチプロテクション設定

Settings → Branches → Add branch ruleset、対象: `main`

| 設定 | 値 |
|------|-----|
| Require a pull request before merging | ON |
| Required approvals | 0（ソロ開発） |
| Do not allow bypassing | ON（管理者にも適用） |
| Allow force pushes | OFF |
| Allow deletions | OFF |
