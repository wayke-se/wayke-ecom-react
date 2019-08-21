import CustomerInformationInputType from "../enums/customer-information-input-type";

export const UPDATE_INPUT_TYPE = "CUSTOMER_UPDATE_INPUT_TYPE";
export const UPDATE_PERSONAL_NUMBER = "CUSTOMER_UPDATE_PERSONAL_NUMBER";
export const UPDATE_NAMED_STRING_ATTRIBUTE = "CUSTOMER_UPDATE_NAMED_STRING_ATTRIBUTE";

export const updateInputType = (dispatch: any, inputType: CustomerInformationInputType) => {
    dispatch({
        type: UPDATE_INPUT_TYPE,
        data: { inputType }
    });
}

export const updatePersonalNumber = (dispatch: any, personalNumber: string) => {
    dispatch({
        type: UPDATE_PERSONAL_NUMBER,
        data: { personalNumber }
    });
};

export const updateNamedStringAttribute = (dispatch: any, name: string, value: string) => {
    dispatch({
        type: UPDATE_NAMED_STRING_ATTRIBUTE,
        data: {
            name,
            value
        }
    });
};