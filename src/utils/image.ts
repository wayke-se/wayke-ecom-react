export const addSizeQuery = (
    imageSource: string,
    width: number,
    height?: number
) => {
    if (!imageSource) {
        return null;
    }

    const hasQuery = imageSource.includes("?");

    if (hasQuery) {
        return imageSource;
    }

    if (width && height) return `${imageSource}?w=${width}&h=${height}`;

    return `${imageSource}?w=${width}`;
};
