import DeliveryType from "../enums/delivery-type";

export const UPDATE_TYPE = "DELIVERY_UPDATE_TYPE";

export const updateZip = (dispatch: any, type: DeliveryType) => {
    dispatch({
        type: UPDATE_TYPE,
        data: { type }
    });
};