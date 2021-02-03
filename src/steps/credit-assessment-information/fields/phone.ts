import StoreAction from "../../../constants/store-action";
import { IEcomStore } from "../../../types";
import { validatePhoneNumber } from "../../../utils/validation";

const createPhoneField = (
    store: IEcomStore,
    isValid: boolean,
    setIsValid: (value: boolean) => void
) => {
    const update = (value: string) =>
        store.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "customer",
            name: "phone",
            value,
        });

    const validate = () => {
        const isValid = validatePhoneNumber(store.data.customer.phone);
        setIsValid(isValid);
    };

    const field = {
        value: store.data.customer.phone,
        displayError: !isValid,
        onChange: update,
        onFinish: validate,
    };
    return field;
};

export default createPhoneField;
