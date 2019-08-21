export const UPDATE_ZIP = "CUSTOMER_UPDATE_ZIP";

export const updateZip = (dispatch: any, zip: string) => {
    dispatch({
        type: UPDATE_ZIP,
        data: { zip }
    });
};