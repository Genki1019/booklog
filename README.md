# 書籍管理アプリ

## 概要

個人用書籍管理アプリです。<br>
[Google Books API](https://developers.google.com/books?hl=ja)と連携してISBNから書籍情報を取得できます。

## API URL 設計

| URL                                  | method | description          | status code |
| ------------------------------------ | ------ | -------------------- | ----------- |
| /api/books/                          | POST   | 書籍登録 API(1 件)   | 201 Created |
| /api/books/{書籍 ID}                 | GET    | 書籍取得 API(1 件)   | 200 OK      |
| /api/books?{クエリ条件}              | GET    | 書籍取得 API(複数件) | 200 OK      |
| /api/books/{書籍 ID}                 | PUT    | 書籍更新 API(1 件)   | 200 OK      |
| /api/books/{書籍 ID}                 | DELETE | 書籍削除 API(1 件)   | 200 OK      |
| /api/books/{書籍 ID}/memos/          | POST   | メモ登録 API(1 件)   | 201 Created |
| /api/books/{書籍 ID}/memos/          | GET    | メモ取得 API(全件)   | 200 OK      |
| /api/books/{書籍 ID}/memos/{メモ ID} | PUT    | メモ更新 API(1 件)   | 200 OK      |
| /api/books/{書籍 ID}/memos/{メモ ID} | DELETE | メモ削除 API(1 件)   | 200 OK      |

## DB 設計

| type    | database name | table name     |
| ------- | ------------- | -------------- |
| logical | booklog       | ユーザテーブル |
| logical | booklog       | user           |

| logical    | physical   | type     | UN  | NN  | PK  | UQ  | ZF  | AI  | default                                               |
| ---------- | ---------- | -------- | --- | --- | --- | --- | --- | --- | ----------------------------------------------------- |
| ID         | id         | int      | o   | o   | o   |     |     | o   |                                                       |
| 名前       | name       | varchar  |     | o   |     |     |     |     |                                                       |
| メール     | email      | varchar  | o   | o   |     | o   |     |     |                                                       |
| パスワード | password   | varchar  |     | o   |     |     |     |     |                                                       |
| 作成日時   | created_at | datetime |     | o   |     |     |     |     | default current_timestamp                             |
| 更新日時   | updated_at | datetime |     | o   |     |     |     |     | default current_timestamp on update current_timestamp |

| type    | database name | table name   |
| ------- | ------------- | ------------ |
| logical | booklog       | 書籍テーブル |
| logical | booklog       | book         |

| logical    | physical   | type     | UN  | NN  | PK  | UQ  | ZF  | AI  | default                                               |
| ---------- | ---------- | -------- | --- | --- | --- | --- | --- | --- | ----------------------------------------------------- |
| ID         | id         | int      | o   | o   | o   |     |     | o   |                                                       |
| ISBN       | isbn       | varchar  |     |     |     |     |     |     |                                                       |
| タイトル   | title      | varchar  |     | o   |     |     |     |     |                                                       |
| 著者       | author     | varchar  |     |     |     |     |     |     |                                                       |
| 画像 URL   | image_url  | varchar  |     |     |     |     |     |     |                                                       |
| ステータス | status     | int      |     | o   |     |     |     |     |                                                       |
| ユーザ ID  | user_id    | int      |     | o   |     |     | o   |     |                                                       |
| 作成日時   | created_at | datetime |     | o   |     |     |     |     | default current_timestamp                             |
| 更新日時   | updated_at | datetime |     | o   |     |     |     |     | default current_timestamp on update current_timestamp |

補足: @@unique([userId, isbn]) により ユーザ内で同じ ISBN を重複登録できない制約 がある。

| type    | database name | table name   |
| ------- | ------------- | ------------ |
| logical | booklog       | メモテーブル |
| logical | booklog       | memo         |

| logical  | physical   | type     | UN  | NN  | PK  | UQ  | ZF  | AI  | default                                               |
| -------- | ---------- | -------- | --- | --- | --- | --- | --- | --- | ----------------------------------------------------- |
| ID       | id         | int      | o   | o   | o   |     |     | o   |                                                       |
| 書籍 ID  | book_id    | int      |     | o   |     |     | o   |     |                                                       |
| 内容     | content    | varchar  |     | o   |     |     |     |     |                                                       |
| 作成日時 | created_at | datetime |     | o   |     |     |     |     | default current_timestamp                             |
| 更新日時 | updated_at | datetime |     | o   |     |     |     |     | default current_timestamp on update current_timestamp |
