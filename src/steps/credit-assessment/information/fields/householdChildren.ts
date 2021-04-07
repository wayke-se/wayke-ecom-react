import StoreAction from "../../../../constants/store-action";
import { IEcomStore } from "../../../../types";
import { validateStringNumberInRange } from "../../../../utils/validation";
import { IValidatableInfoItem } from "../types";

const createHouseholdChildrenField = (
    store: IEcomStore,
    isValid: boolean,
    setIsValid: (value: boolean) => void
): IValidatableInfoItem => {
    const value = store.data.householdEconomy.householdChildren;

    const update = (newValue: string) =>
        store.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "householdEconomy",
            name: "householdChildren",
            value: newValue,
        });

    const validate = () => {
        const isValid = validateStringNumberInRange(value, 0, 999);
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

export default createHouseholdChildrenField;
