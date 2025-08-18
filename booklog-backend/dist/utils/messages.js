export const messages = {
    errors: {
        isbnRequired: "ISBNは必須です。",
        titleRequired: "タイトルは必須です。",
        authorRequired: "著者は必須です。",
        statusRequired: "ステータスは必須です。",
        userIdRequired: "ユーザーIDは必須です。",
        bookAlreadyExists: "この書籍はすでに登録されています。",
        bookNotFound: "該当する書籍が見つかりませんでした。",
        bookDeleteNotFound: (id) => `ID:${id}の書籍は存在しません。`,
        imageDeleteError: (filePath) => `画像ファイルの削除に失敗しました: ${filePath}`,
        serverError: "サーバーエラーが発生しました。",
    },
    success: {
        bookCreated: "書籍が正常に登録されました。",
        bookUpdated: "書籍が正常に更新されました。",
        bookDeleted: (id) => `ID:${id}の書籍を削除しました。`,
        imageDeleted: (filePath) => `画像ファイルを削除しました: ${filePath}`,
        memoDeleted: (id) => `ID:${id}のメモを削除しました。`,
    },
};
