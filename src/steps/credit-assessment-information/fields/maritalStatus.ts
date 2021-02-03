import StoreAction from "../../../constants/store-action";
import { IEcomStore } from "../../../types";

const createMaritalStatusField = (store: IEcomStore) => {
    const value = store.data.householdEconomy.maritalStatus;

    const update = (newValue: string) =>
        store.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "householdEconomy",
            name: "maritalStatus",
            value: newValue,
        });

    const field = {
        value,
        onChange: update,
    };
    return field;
};

export default createMaritalStatusField;
