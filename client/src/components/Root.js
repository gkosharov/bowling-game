import React, {Component} from 'react'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Provider} from 'react-redux'
import Immutable from 'immutable'
import {socket, configureStore} from '../store/configureStore'
import {push} from 'react-router-redux'
import {triggerError} from '../actions/Error'
import {loadGames, roll, rollFromOtherPlayer, finish} from '../actions/Game'
import {triggerMessage} from '../actions/Common'
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App'

injectTapEventPlugin();

/* This is necessary initial state for the react-redux-router to work properly with immutable js */

const initialState = Immutable.fromJS({
    errors: {},
    messages: {},
    routes: {},
    login: {},
    game: {},
    lobby: {},
    route: {
        locationBeforeTransitions: null
    }
});

const {store, history} = configureStore(initialState);


/* socket event handlers */
socket.on('connect', (data)=> {
    console.log("Connected! -> " + JSON.stringify(data));
});

socket.on('joined', (data)=> {
    console.log("Joined! -> " + JSON.stringify(data));
    if (store.dispatch) {
        store.dispatch(loadGames("/games"));
    }
});

socket.on('ready', (data)=> {
    console.log("Ready! -> " + JSON.stringify(data));
    if (store.dispatch) {
        store.dispatch(push("/game"));
    }
});

socket.on('roll', (data)=> {
    console.log("roll! -> " + JSON.stringify(data));
    if (store.dispatch) {
        store.dispatch(loadGames("/games"));
    }
});

socket.on('error', (data)=> {
    console.log("Error! -> " + JSON.stringify(data));
    if (store.dispatch) {
        store.dispatch(triggerError(JSON.stringify(data)));
    }
});

socket.on('finish', (data)=> {
    console.log("Finished! -> " + JSON.stringify(data));
    if (store.dispatch) {
        store.dispatch(finish(data));
        store.dispatch(triggerMessage("GAME OVER", `Winner is ${data.winner}`));
    }
});

socket.on('start', (data)=> {
    console.log("Start! -> " + JSON.stringify(data));
    store.dispatch(loadGames("/games"));
});

/* here we go */
export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider muiTheme={getMuiTheme(baseTheme)}>
                    <App history={history}/>
                </MuiThemeProvider>
            </Provider>
        );
    }
}
