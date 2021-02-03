import StoreAction from "../../../constants/store-action";
import { IEcomStore } from "../../../types";
import { validateEmail } from "../../../utils/validation";

const createEmailField = (
    store: IEcomStore,
    isValid: boolean,
    setIsValid: (value: boolean) => void
) => {
    const value = store.data.customer.email;

    const update = (newValue: string) =>
        store.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "customer",
            name: "email",
            value: newValue,
        });

    const validate = () => {
        const isValid = validateEmail(value);
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

export default createEmailField;
