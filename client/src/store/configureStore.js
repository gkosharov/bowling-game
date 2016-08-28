import { createStore, applyMiddleware, compose } from 'redux';
//import { combineReducers } from 'immutable-reducers'
import { combineReducers } from 'redux-immutable'
import { createHistory, useBeforeUnload } from 'history'
import { Router, browserHistory, useRouterHistory } from 'react-router'
import thunkMiddleware from 'redux-thunk'
import { apiMiddleware } from '../middleware'
import loggerMiddleware from 'redux-logger';
import Immutable from 'immutable'
import merge from 'lodash/object/merge'
import isObject from 'lodash/lang/isObject'
import * as reducers from '../reducers'
import createSocketIoMiddleware from 'redux-socket.io';
import routerMiddleware from '../middleware/RouterMiddleware'
import combineActionsMiddleware from 'redux-combine-actions';
import io from 'socket.io-client';

import { ROOT_PATH } from '../web.config.js'

var history = null;

const reducer = combineReducers(
    reducers
);

export const socket = io.connect(`${location.origin}${location.pathname}`/*'http://localhost:4044'*//*, {forceNew: true}*/);

let socketIoMiddleware = createSocketIoMiddleware(socket, "ws/");

var appHistory = useRouterHistory(useBeforeUnload(createHistory))({basename: ROOT_PATH});

const historyMiddleware = routerMiddleware(getHistory);

const createStoreWithMiddleware = applyMiddleware(
    socketIoMiddleware,
    combineActionsMiddleware,
    historyMiddleware,
    thunkMiddleware,
    apiMiddleware
    //loggerMiddleware
)(createStore);



function getHistory() {
    return appHistory;
}

export function configureStore(initialState) {

    const store = createStoreWithMiddleware(reducer, initialState, window.devToolsExtension ? window.devToolsExtension() : f => f);

    return {
        store: store,
        history: getHistory()
    };
}
