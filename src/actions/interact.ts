export const SET_INTERACTED = "INTERACT_SET_INTERACTED";

export const setInteracted = (dispatch: any, newInteract: any) => {
    dispatch({
        type: SET_INTERACTED,
        data: {
            newInteract
        }
    });
};