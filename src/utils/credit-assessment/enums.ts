import { Employment, MaritalStatus } from "@wayke-se/ecom";

export const asMaritalStatus = (value: string) => {
    switch (value) {
        case "Gift":
            return MaritalStatus.Married;
        default:
            return MaritalStatus.Single;
    }
};

export const asEmployment = (value: string) => {
    switch (value) {
        case "Fulltidsanställd":
            return Employment.FullTimeEmployed;
        case "Student":
            return Employment.Student;
        case "Deltidsanställd":
            return Employment.TemporarilyEmployed;
        case "Pensionär":
            return Employment.Retired;
        case "Egenföretagare":
            return Employment.SelfEmployed;
        default:
            return Employment.Other;
    }
};
