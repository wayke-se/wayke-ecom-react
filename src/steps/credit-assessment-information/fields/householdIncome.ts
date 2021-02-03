import StoreAction from "../../../constants/store-action";
import { IEcomStore } from "../../../types";
import { validateStringNumberInRange } from "../../../utils/validation";

const createHouseholdIncomeField = (
    store: IEcomStore,
    isValid: boolean,
    setIsValid: (value: boolean) => void
) => {
    const value = store.data.householdEconomy.householdIncome;

    const update = (newValue: string) =>
        store.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "householdEconomy",
            name: "householdIncome",
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

export default createHouseholdIncomeField;
