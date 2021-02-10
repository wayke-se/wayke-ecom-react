import StoreAction from "../../../../constants/store-action";
import { IEcomStore } from "../../../../types";
import { validateStringNumberInRange } from "../../../../utils/validation";
import { IValidatableInfoItem } from "../types";

const createHouseholdDebtField = (
    store: IEcomStore,
    isValid: boolean,
    setIsValid: (value: boolean) => void
): IValidatableInfoItem => {
    const value = store.data.householdEconomy.householdDebt;

    const update = (newValue: string) =>
        store.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "householdEconomy",
            name: "householdDebt",
            value: newValue,
        });

    const validate = () => {
        const isValid = validateStringNumberInRange(
            value,
            -999999999,
            999999999
        );
        setIsValid(isValid);
    };

    const field = {
        value,
        displayError: !isValid,
        onChange: update,
        onFinish: validate,
    };
    return field;
};

export default createHouseholdDebtField;
