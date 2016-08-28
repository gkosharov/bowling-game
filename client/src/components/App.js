import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Router, Route, IndexRoute, Link, useRouterHistory } from 'react-router'
import Login from './login/Login'
import Signin from './signin/Signin'
import Lobby from './lobby/Lobby'
import Game from './game/Game'
import ErrorDialog from './error/ErrorDialog'
import MessageDialog from './message/MessageDialog'

function createElement(Component, props) {
    //var key = props.routeParams.dashboardId ? props.routeParams.dashboardId + "-" + props.routeParams.objectId :null; // some key that changes across route changes
    var key = props.routeParams.splat || "";
    if(!key) {
        key = props.routeParams.id;
    }
    return <Component key={key} {...props} />;

}

export default class App extends Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        if(process && process.env){
            console.log("Process.env = " + JSON.stringify(process.env))
        }

        return (
            <div>
                <ErrorDialog/>
                <MessageDialog/>
                <Router history={this.props.history} createElement={createElement}>
                    <Route path="/login" component={Login} />
                    <Route path="/signin" component={Signin} />
                    <Route path={"/"} component={Login}/>
                    <Route path={"/lobby"} component={Lobby}/>
                    <Route path={"/game(:/id)"} component={Game}/>
                </Router>

            </div>
        );
    }
}