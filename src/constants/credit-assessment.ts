export const MARITAL_STATUS = Object.freeze({
    married: "Gift eller sambo",
    single: "Singel",
});
export const MARITAL_STATUS_VALUES = Object.keys(MARITAL_STATUS).map(
    (key) => MARITAL_STATUS[key]
);
export const MARITAL_STATUS_DEFAULT = MARITAL_STATUS.married;

export const OCCUPATION = Object.freeze({
    fullTimeEmployed: "Fast- eller tillsvidareanställd",
    student: "Student",
    temporarilyEmployed: "Visstidsanställd",
    retired: "Pensionär",
    selfEmployed: "Egenföretagare",
    other: "Annat",
});
export const OCCUPATION_VALUES = Object.keys(OCCUPATION).map(
    (key) => OCCUPATION[key]
);
export const OCCUPATION_DEFAULT = OCCUPATION.fullTimeEmployed;
