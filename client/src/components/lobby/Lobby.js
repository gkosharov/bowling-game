/**
 * Created by g.kosharov on 28.8.2016
 */
import React, {Component} from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Divider from 'material-ui/Divider';
import Button from 'material-ui/RaisedButton'
import AppBar from 'material-ui/AppBar'
import { push } from 'react-router-redux'
import CircularProgress from 'material-ui/CircularProgress'
import Center from 'react-center'
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import { joinGame, dialog, loadGames } from '../../actions/Game'
import isString from 'lodash/lang/isString'
import map from 'lodash/collection/map'
import NewGameDialog from '../game/NewGameDialog'
import { connect } from 'react-redux'
import { triggerError } from '../../actions/Error'


function loadData(props) {
    console.log("Lobby load data called...");
    if (props && props.loadGames) {
        props.loadGames();
    } else {
        props.triggerError("Corrupt lobby data!");
    }
}

class Lobby extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("Lobby will mount...");
        loadData(this.props);
    }

    onJoinGame(gameId, user, event) {
        console.log("Joining game...");
        if (this.props.joinGame) {
            this.props.joinGame(gameId, user);
            setTimeout(this.props.push("/game"), 2000);
        }
    }

    onCreateGame(event) {
        console.log("Create game...");
        if (this.props.dialog) {
            this.props.dialog(this.props);
        }
    }

    onRefreshGames(event) {
        console.log("Game list updating...");
        if (this.props.loadGames) {
            this.props.loadGames();
        }
    }

    buildItems() {
        var user = this.props.user;
        if (this.props.games) {
            return map(this.props.games, (item)=> {
                return (<ListItem primaryText={item.id} secondaryText={item.status} onClick={this.onJoinGame.bind(this, item.id, user)} rightIcon={<ActionInfo />}/>);
            });
        }
        return [];
    }

    render() {
        const {topOffset, leftOffset} = this.props;
        const buttonStyle = {
            margin: 12
        };
        const style = {
            position: 'absolute',
            width: 500,
            top: this.props.topOffset,
            left: this.props.leftOffset
        };

        if (this.props.games && this.props.games.length) {
            return (
                <div>
                    <AppBar
                        title={`${this.props.user} - Available games`}
                        />
                    <List
                        onSelectItem={this.onJoinGame.bind(this)}
                        >
                        {this.buildItems()}
                    </List>
                    <NewGameDialog/>
                    <Divider/>
                    <Button label="Create new game" primary={true} style={buttonStyle}
                            onClick={this.onCreateGame.bind(this)}/>
                    <Button label="Refresh" onClick={this.onRefreshGames.bind(this)} style={buttonStyle}/>
                </div>
            )
        }
        if (this.props.noGames) {
            return (
                <div>
                    <AppBar title='Available games'/>
                    <Center>
                        <h1>NO AVAILABLE GAMES YET!</h1>
                        <span>You can start a new game though :)</span>
                        <NewGameDialog/>
                    </Center>
                    <Divider/>
                    <Button label="Create new game" primary={true} style={buttonStyle}
                            onClick={this.onCreateGame.bind(this)}/>
                    <Button label="Refresh" onClick={this.onRefreshGames.bind(this)} style={buttonStyle}/>
                </div>
            );
        }
        return (
            <div>
                <AppBar title='Loading available games...'/>
                <Center>
                    <CircularProgress mode="indeterminate"/>
                </Center>
            </div>
        )
    }
}


function mapStateToProps(state, ownProps) {
    var lobby = state.get("lobby");
    var user = state.getIn(["login", "username"]);
    if(user && user.toJS) user = user.toJS();
    if(lobby.toJS) lobby = lobby.toJS();
    return Object.assign({}, ownProps, {user: user}, lobby);
}


export default connect(mapStateToProps, {joinGame, loadGames, dialog, push, triggerError})(Lobby);