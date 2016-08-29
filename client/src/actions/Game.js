/**
 * Created by g.kosharov on 28.8.2016
 */

import { CALL_API } from '../middleware'


export const START_GAME = 'ws/start';

export function startGame(payload) {
    return {
        type: START_GAME,
        payload: payload
    };
}

export function triggerStartGame(payload) {
    return (dispatch, getState) => {

        return dispatch(startGame(payload));

    };
}

//GET available games for the lobby
export const GAMES_REQUEST = 'GAMES_REQUEST';
export const GAMES_SUCCESS = 'GAMES_SUCCESS';
export const GAMES_FAILURE = 'GAMES_FAILURE';

function fetchGames(endpoint) {
    return {
        [CALL_API]: {
            types: [
                GAMES_REQUEST,
                [
                    {
                        type: GAMES_SUCCESS,
                        payload: (action, state, res) => {
                            let toReturn = {
                                games: res
                            };
                            if(!res || (res && !res.length)){
                                toReturn.noGames = true;
                            }else{
                                toReturn.noGames = false;
                            }
                            return toReturn;
                        }
                    }
                ],
                GAMES_FAILURE
            ],
            method: 'GET',
            endpoint: endpoint
        }
    };
}

export function loadGames(endpoint, requiredFields = []) {
    return (dispatch, getState) => {
        if (!endpoint) {
            endpoint = "/games"
        }
        return dispatch(fetchGames(endpoint));

    };
}

//GET game data for the in-game panel
export const GAME_DATA_REQUEST = 'GAME_DATA_REQUEST';
export const GAME_DATA_SUCCESS = 'GAME_DATA_SUCCESS';
export const GAME_DATA_FAILURE = 'GAME_DATA_FAILURE';

function fetchGameData(endpoint, gameId) {
    return {
        [CALL_API]: {
            types: [
                GAME_DATA_REQUEST,
                [
                    {
                        type: GAME_DATA_SUCCESS,
                        payload: (action, state, res) => {
                            return res;
                        }
                    }/*,
                    (dispatch, getState) => dispatch(startGame(gameId))*/
                ],
                GAME_DATA_FAILURE
            ],
            method: 'GET',
            endpoint: endpoint
        }
    };
}

export function loadGameData(endpoint, requiredFields = []) {
    return (dispatch, getState) => {
        var state = getState();
        var gameId = state.getIn(["game", "id"]);
        if (!endpoint) {
            endpoint = `/games/${gameId}`;
        }
        return dispatch(fetchGameData(endpoint, gameId));

    };
}


export const POST_GAME_REQUEST = 'POST_GAME_REQUEST';
export const POST_GAME_SUCCESS = 'POST_GAME_SUCCESS';
export const POST_GAME_FAILURE = 'POST_GAME_FAILURE';

function requestPostGame(endpoint, payload) {
    return {
        [CALL_API]: {
            types: [
                POST_GAME_REQUEST,
                [
                    POST_GAME_SUCCESS,
                    (dispatch, getState) => {dispatch(closeDialog())}
                ],
                POST_GAME_FAILURE
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

export function createGame(endpoint){
    return (dispatch, getState) => {
        if (!endpoint) {
            endpoint = "/games"
        }
        var payload = {};
        var state = getState();
        var startingNumber = state.getIn(["game", "startingNumber"]);
        if(startingNumber){
            payload.startingNumber = startingNumber;
        }
        dispatch(requestPostGame(endpoint, payload));

    };
}

export const TRIGGER_NEW_GAME_DIALOG = "TRIGGER_NEW_GAME_DIALOG";
export const DISMISS_NEW_GAME_DIALOG = "DISMISS_NEW_GAME_DIALOG";

export function dialog(opened, message) {
    return {
        type: TRIGGER_NEW_GAME_DIALOG,
        payload: message,
        opened: opened
    };
}

export function closeDialog() {
    return {
        type: DISMISS_NEW_GAME_DIALOG,
        opened: false
    };
}

export function setStartingNumber(payload){
    return {
        type: "SET_STARTING_NUMBER",
        payload: payload
    }
}

export function roll(payload) {
    return {
        type: "ws/roll",
        payload: payload
    }
}
export function rollFromOtherPlayer(payload) {
    return {
        type: "MOVE_FROM_OTHER_PLAYER",
        payload: payload
    }
}

export function finish(payload) {
    return {
        type: "FINISH_GAME",
        payload: payload
    }
}

export function joinGame(gameId, username){
    return {
        type: "ws/join",
        payload: {id: gameId, username: username}
    }
}