/**
 * Created by g.kosharov on 28.8.2016
 */
export const TRIGGER_ERROR = "TRIGGER_ERROR";
export const DISMISS_ERROR = "DISMISS_ERROR";

/* Error modal actions */
function error(opened, message) {
    return {
        type: TRIGGER_ERROR,
        payload: message,
        opened: opened
    };
}

function closeError() {
    return {
        type: DISMISS_ERROR,
        opened: false
    };
}

export function submitError(error){
    return {
        type: "SUBMIT_ERROR",
        payload: error
    }
}
export function openErrors(){
    return {
        type: "OPEN_ERRORS"
    }
}


export function triggerError(message) {
    return (dispatch, getState) => {
        var errors = null;
        if (getState().errors) {
            errors = getState().errors;
        }
        return dispatch(error(true, message));
    };
}

export function dismissError() {
    return (dispatch, getState) => {
        return dispatch(closeError());
    };
}