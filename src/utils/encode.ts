export const htmlEncode = (value: string) => {
    if (!value) {
        return value;
    }

    return value
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};
