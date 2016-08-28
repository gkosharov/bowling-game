//import { createReducer } from 'immutable-reducers'
import Immutable from 'immutable'
import merge from 'lodash/object/merge'
import remove from 'lodash/array/remove'
import union from 'lodash/array/union'
import findIndex from 'lodash/array/findIndex'
import forEach from 'lodash/collection/forEach'
import map from 'lodash/collection/map'
import find from 'lodash/collection/find'
import isEmpty from 'lodash/lang/isEmpty'
import isArray from 'lodash/lang/isArray'
import indexOf from 'lodash/array/indexOf'
import generate from 'shortid'
import { CALL_HISTORY_METHOD } from 'react-router-redux'

import { LOCATION_CHANGE } from 'react-router-redux'

import * as actionTypes from '../constants/ActionTypes'

export function errors(state, action) {
    if (action.type == actionTypes.TRIGGER_ERROR && action.payload) {
        return state.merge({"opened": true, "message": action.payload});
    }

    if (action.type == actionTypes.DISMISS_ERROR) {
        return state.merge({"opened": false});
    }

    if (action.type == "GAMES_FAILURE") {
        return state.merge({
            "opened": true,
            "message": "Failed to load the available games!",
            details: action.payload ? action.payload : null
        });
    }

    if (action.type == "LOGIN_FAILURE") {
        return state.merge({
            "opened": true,
            "message": "Failed to login!",
            details: action.payload ? action.payload : null
        });
    }

    return state.merge({});
}

export function routes(state, action) {

    if (action.type == "UPDATE_ROUTES") {
        var path = action.payload.path;
        if (state.get("routes")) {
            var routes = state.get("routes");
            if (!routes.includes(path)) {
                routes = routes.push(path);
            }
            state = state.setIn(["routes"], routes);
            return state.set("current", path);

        } else {
            return state.merge(Immutable.fromJS({current: path, routes: [path]}));
        }
    }

    return state;
}

export function route(state, action) {
    if (action.type === LOCATION_CHANGE) {
        return state.set("location", action.payload);
    }

    return state;
}

export function login(state, action) {
    if (action.type == "SET_CREDENTIALS") {
        return state.set(action.payload.credentialType, action.payload.value);
    }

    if (action.type == "LOGIN_SUCCESS") {
        return state.merge({success: action.payload});
    }

    if (action.type == "LOGIN_FAIL") {
        return state.merge({fail: action.payload});
    }

    return state;

}

export function lobby(state, action) {

    if (action.type == "GAMES_SUCCESS") {
        return state.mergeDeep(action.payload);
    }

    if(action.type == "GAME_DATA_SUCCESS"){
        var games = state.get("games");
        var gameIndex = games.findIndex((item)=>{
            return item.get("id") == action.payload.id
        });
        return state.setIn(["games", gameIndex], Immutable.fromJS(action.payload));
    }

    if(action.type == "FINISH_GAME"){
        var games = state.get("games");
        var gameIndex = games.findIndex((item)=>{
            return item.get("id") == action.payload.id
        });
        return state.setIn(["games", gameIndex], Immutable.fromJS(action.payload));
    }

    return state;
}

export function messages(state, action){
    if (action.type == "TRIGGER_MESSAGE" && action.payload) {
        return state.merge({"opened": true, "title": action.payload.title, "message": action.payload.message});
    }

    if (action.type == "DISMISS_MESSAGE") {
        return state.merge({"opened": false});
    }

    return state;
}

export function game(state, action){

    if (action.type == "SET" && action.payload) {
        var path = isArray(action.payload.path) ? action.payload.path : action.payload.path.split('.');
        var toSet = action.payload && action.payload.path ? state.getIn(path) : {};
        if (toSet && action.payload.toSet) {
            return state.setIn(path, toSet.mergeDeep(action.payload.toSet));
        } else {
            return state;
        }
    }

    if (action.type == "TRIGGER_NEW_GAME_DIALOG") {
        return state.merge({"opened": true});
    }

    if (action.type == "DISMISS_NEW_GAME_DIALOG") {
        return state.merge({"opened": false});
    }

    if (action.type == "DISMISS_NEW_GAME_DIALOG") {
        return state.merge({"opened": false});
    }

    if (action.type == "SET_STARTING_NUMBER") {
        return state.mergeDeep({"startingNumber": action.payload});
    }

    if (action.type == "ws/join") {
        return state.mergeDeep(action.payload);
    }

    if (action.type == "ws/roll") {
        var moves = state.get("moves") || Immutable.fromJS([]);
        moves = moves.push(action.payload);
        return state.set("moves", moves);
    }

    if (action.type == "MOVE_FROM_OTHER_PLAYER") {
        var moves = state.get("moves") || Immutable.fromJS([]);
        moves = moves.push(action.payload);
        return state.set("moves", moves);
    }

    if(action.type == "GAME_DATA_SUCCESS"){
        return state.merge(action.payload);
    }

    return state;
}