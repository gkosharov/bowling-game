/**
 * Created by g.kosharov on 28.8.2016
 */

function set(path, value, options) {
    var index = options && options.index ? options.index : 0;
    return {
        type: "SET",
        payload: {
            path: path,
            toSet: value
        }
    }
}

export function triggerSet(path, value, options) {
    return (dispatch, getState)=> {
        return dispatch(set(path, value, options))
    }
}


export const TRIGGER_MESSAGE = "TRIGGER_MESSAGE";
export const DISMISS_MESSAGE = "DISMISS_MESSAGE";

/* Message modal */
function message(opened, payload) {
    return {
        type: TRIGGER_MESSAGE,
        payload: payload,
        opened: opened
    };
}

function closeMessage() {
    return {
        type: DISMISS_MESSAGE,
        opened: false
    };
}

export function submitMessage(message){
    return {
        type: "SUBMIT_MESSAGE",
        payload: message
    }
}
export function openMessages(){
    return {
        type: "OPEN_MESSAGES"
    }
}


export function triggerMessage(title, data) {
    return (dispatch, getState) => {

        return dispatch(message(true, {title: title, message: data}));
    };
}

export function dismissMessage() {
    return (dispatch, getState) => {
        return dispatch(closeMessage());
    };
}