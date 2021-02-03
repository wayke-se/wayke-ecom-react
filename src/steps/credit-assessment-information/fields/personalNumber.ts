import StoreAction from "../../../constants/store-action";
import { IEcomStore } from "../../../types";
import { validatePersonalNumber } from "../../../utils/validation";

const createPersonalNumberField = (
    store: IEcomStore,
    isValid: boolean,
    setIsValid: (value: boolean) => void
) => {
    const value = store.data.customer.personalNumber;

    const update = (newValue: string) =>
        store.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "customer",
            name: "personalNumber",
            value: newValue,
        });

    const validate = () => {
        const isValid = validatePersonalNumber(value);
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

export default createPersonalNumberField;
