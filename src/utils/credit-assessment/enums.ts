import { Employment, MaritalStatus } from "@wayke-se/ecom";
import { MARITAL_STATUS, OCCUPATION } from "../../constants/credit-assessment";

export const asMaritalStatus = (value: string) => {
    switch (value) {
        case MARITAL_STATUS.married:
            return MaritalStatus.Married;
        default:
            return MaritalStatus.Single;
    }
};

export const asEmployment = (value: string) => {
    switch (value) {
        case OCCUPATION.fullTimeEmployed:
            return Employment.FullTimeEmployed;
        case OCCUPATION.student:
            return Employment.Student;
        case OCCUPATION.temporarilyEmployed:
            return Employment.TemporarilyEmployed;
        case OCCUPATION.retired:
            return Employment.Retired;
        case OCCUPATION.selfEmployed:
            return Employment.SelfEmployed;
        default:
            return Employment.Other;
    }
};
