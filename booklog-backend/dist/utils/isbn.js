export const formatISBN = (isbn) => {
    if (isbn.length === 13) {
        // ISBN-10 to ISBN-13 conversion
        return `978${isbn.slice(0, -1)}`;
    }
};
