/**
 * Created by g.kosharov on 28.8.2016
 */
import React, {Component} from 'react'
import Divider from 'material-ui/Divider';
import Button from 'material-ui/RaisedButton'
import colors from 'material-ui/styles/colors';
import {push} from 'react-router-redux'
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table';
import AppBar from 'material-ui/AppBar'
import CircularProgress from 'material-ui/CircularProgress'
import Center from 'react-center'
import {loadGameData, roll, triggerStartGame} from '../../actions/Game'
import {triggerMessage} from '../../actions/Common'
import map from 'lodash/collection/map'
import forEach from 'lodash/collection/forEach'
import findLast from 'lodash/collection/findLast'
import {connect} from 'react-redux'
import {triggerError} from '../../actions/Error'
import getRandomIntInclusive from '../../utils/getRandomIntInclusive'


function loadData(props) {
    console.log("Game load data called...");
    if (props && props.loadGameData) {
        props.loadGameData();
    } else {
        props.triggerError("Corrupt game data!");
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("Game will mount...");
        loadData(this.props);
    }

    onLeaveGame() {
        console.log("Game left!");
        if (this.props.push) {
            this.props.push('/lobby');
        }
    }


    onRoll() {
        console.log("Player rolled!");
        if (this.props.roll) {
            this.props.roll({
                gameId: this.props.id,
                playerId: this.props.playerId,
                frameId: this.props.frameId || 1,
                knockedPins: getRandomIntInclusive(0, 10)
            });
        }
    }

    onStartGame() {
        console.log("Game started");
        if (this.props.triggerStartGame) {
            this.props.triggerStartGame({
                gameId: this.props.game.id,
                playerId: this.props.playerId,
                frameId: this.props.frameId,
                knockedPins: getRandomIntInclusive(0, 10)
            });
        }
    }

    buildItems() {
        var rows = [];
        forEach(this.props.players, (player)=> {
            let columns = [];
            let total = 0;
            let playerFrames = find(this.props.frames, (frame)=> {
                return frames.playerId == player;
            });
            columns.push(
                <TableRowColumn>{player}</TableRowColumn>
            );
            for (var i = 0; i < 10; i++) {
                let frame = findLast(playerFrames, (f)=> {
                    return f.id == i;
                });
                let rolls = frame ? frame.rolls : [];
                let result = frame ? frame.result : "";
                total+=result;
                columns.push(
                    <TableRowColumn>
                        <div>{JSON.stringify(rolls)}</div>
                        <div>{JSON.stringify(result)}</div>
                    </TableRowColumn>
                );
            }

            columns.push(
                <TableRowColumn>{total}</TableRowColumn>
            );
            rows.push(
                <TableRow>{columns}</TableRow>
            )
        });

        return rows;
    }

    buildHeaders() {
        var result = [
            <TableHeaderColumn colSpan="1" tooltip="Game Id" style={{textAlign: 'left'}}>
                {this.props.id}
            </TableHeaderColumn>
        ];
        for (var i = 1; i < 10; i++) {
            result.push(
                <TableHeaderColumn colSpan="2" style={{textAlign: 'left'}}>
                    {i}
                </TableHeaderColumn>
            );
        }
        result.push(
            <TableHeaderColumn colSpan="3" style={{textAlign: 'left'}}>
                {i}
            </TableHeaderColumn>
        );
        result.push(
            <TableHeaderColumn colSpan="1" tooltip="Total" style={{textAlign: 'left'}}>
                Total
            </TableHeaderColumn>
        );

        return result;
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
        const tableProps = {
            height: 500,
            fixedHeader: true,
            fixedFooter: true,
            selectable: false,
            multiSelectable: false,
            enableSelectAll: false,
            showCheckboxes: false,
            deselectOnClickaway: true,
            showRowHover: true,
            stripedRows: false
        };

        if (this.props.id) {
            var winner = this.props.winner ? "Winner: " + this.props.winner : "";
            return (
                <div>
                    <AppBar
                        title={`${this.props.username} - Game: ${this.props.id} - Status: ${this.props.status} ${winner}`}
                    />

                    <Table
                        height={tableProps.height}
                        fixedHeader={tableProps.fixedHeader}
                        fixedFooter={tableProps.fixedFooter}
                        selectable={tableProps.selectable}
                        multiSelectable={tableProps.multiSelectable}
                    >
                        <TableHeader
                            displaySelectAll={tableProps.showCheckboxes}
                            adjustForCheckbox={tableProps.showCheckboxes}
                            enableSelectAll={tableProps.enableSelectAll}
                        >
                            <TableRow>

                                {this.buildHeaders()}
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={tableProps.showCheckboxes}
                            deselectOnClickaway={tableProps.deselectOnClickaway}
                            showRowHover={tableProps.showRowHover}
                            stripedRows={tableProps.stripedRows}
                        >
                            {this.buildItems()}
                        </TableBody>
                    </Table>
                    <Divider/>
                    <Button label="Roll" primary={true} style={buttonStyle}
                            onClick={this.onRoll.bind(this)}/>
                    <Button label="Quit" primary={true} style={buttonStyle}
                            onClick={this.onLeaveGame.bind(this)}/>
                    <Button label="Start" primary={true} style={buttonStyle}
                            onClick={this.onStartGame.bind(this)}/>
                </div>
            )
        }

        return (
            <div>
                <AppBar title='Loading...'/>
                <Center>
                    <CircularProgress mode="indeterminate"/>
                </Center>
            </div>
        )
    }
}


function mapStateToProps(state, ownProps) {
    var game = state.get("game");

    var lobby = state.get("lobby");
    var gameId = game.get("id") || (ownProps.routeParams && ownProps.routeParams.id ? ownProps.routeParams.id : null);
    var frameId = game.get("currentFrame") || 1;
    var gameDetails = null;
    if (gameId) {
        gameDetails = lobby.get("games").find((item)=> {
            return item.get("id") == gameId;
        });
    }
    var login = state.get("login");
    if (game.toJS) game = game.toJS();
    if (gameDetails && gameDetails.toJS) {
        gameDetails = gameDetails.toJS();
        game = Object.assign({}, gameDetails, game);
    }

    return Object.assign({}, ownProps, login, game);
}


export default connect(mapStateToProps, {
    roll,
    triggerError,
    loadGameData,
    push,
    triggerMessage,
    triggerStartGame
})(Game);