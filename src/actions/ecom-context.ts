export const UPDATE_HAS_ACCEPTED_TERMS = "ENUM_CONTEXT_UPDATE_HAS_ACCEPTED_TERMS";

export const updateZip = (dispatch: any, hasAcceptedTerms: boolean) => {
    dispatch({
        type: UPDATE_HAS_ACCEPTED_TERMS,
        data: { hasAcceptedTerms }
    });
};