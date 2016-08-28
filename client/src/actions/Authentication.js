/**
 * Created by g.kosharov on 28.8.2016
 */

import forEach from 'lodash/collection/forEach'
import { CALL_API } from '../middleware'
import { push } from 'react-router-redux'


export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

function login(endpoint, payload) {
    return {
        [CALL_API]: {
            types: [
                LOGIN_REQUEST,
                [
                    LOGIN_SUCCESS,
                    (dispatch, getState) => {

                        dispatch(push("/lobby"));

                    }
                ],
                LOGIN_FAILURE

            ],
            method: 'POST',
            endpoint: endpoint,
            headers: {
                "Content-Type": "application/json"
            }
        },

        payload: payload
    };
}

export function requestLogin(username, password, requiredFields = []) {
    return (dispatch, getState) => {
        var endpoint = "/login";
        var state = getState();
        var payload = state.get("login");
        if (payload && payload.toJS()) {
            payload = payload.toJS();
        }
        return dispatch(login(endpoint, payload));

    };
}

export function setCredentials(credentialType, value) {
    var payload = {
        "credentialType": credentialType,
        "value": value
    };
    return {
        type: "SET_CREDENTIALS",
        payload: payload
    }
}


export const SIGNIN_REQUEST = 'SIGNIN_REQUEST';
export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS';
export const SIGNIN_FAILURE = 'SIGNIN_FAILURE';

function signin(endpoint, payload) {
    return {
        [CALL_API]: {
            types: [
                SIGNIN_REQUEST,
                [
                    SIGNIN_SUCCESS,
                    (dispatch, getState) => {

                        dispatch(push("/login"));

                    }
                ],
                SIGNIN_FAILURE

            ],
            method: 'POST',
            endpoint: endpoint,
            headers: {
                "Content-Type": "application/json"
            }
        },

        payload: payload
    };
}

export function requestSignin() {
    return (dispatch, getState) => {
        var endpoint = "/register";
        var state = getState();
        var payload = state.get("login");
        if (payload && payload.toJS()) {
            payload = payload.toJS();
        }
        return dispatch(signin(endpoint, payload));

    };
}
