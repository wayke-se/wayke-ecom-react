import StoreAction from "../../../../constants/store-action";
import { IEcomStore } from "../../../../types";
import { IInfoItem } from "../types";

const createEmploymentField = (store: IEcomStore): IInfoItem => {
    const value = store.data.householdEconomy.employment;

    const update = (newValue: string) =>
        store.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "householdEconomy",
            name: "employment",
            value: newValue,
        });

    const field = {
        value,
        onChange: update,
    };
    return field;
};

export default createEmploymentField;
