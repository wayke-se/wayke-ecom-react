import StoreAction from "../../../../constants/store-action";
import { IEcomStore } from "../../../../types";
import { IInfoItem } from "../types";

const createMaritalStatusField = (store: IEcomStore): IInfoItem => {
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
