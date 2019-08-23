export const getAllEnumValues = (enumObject) => {
    return Object.keys(enumObject).filter(key => isNaN(enumObject[key])).map(k => parseInt(k));
};