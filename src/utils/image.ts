export const addSizeQuery = (
    imageSource: string,
    width: number,
    height: number
) => {
    if (!imageSource) {
        return null;
    }

    const hasQuery = imageSource.includes("?");

    if (hasQuery) {
        return imageSource;
    }

    return `${imageSource}?w=${width}&h=${height}`;
};
