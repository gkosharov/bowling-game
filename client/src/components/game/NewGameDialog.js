/**
 * Created by g.kosharov on 28.8.2016
 */


import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { createGame, closeDialog } from '../../actions/Game'


function close(props) {
    if (props.closeDialog) {
        props.closeDialog({opened: false});
    }
}
class NewGameDialog extends Component {
    constructor(props) {
        super(props);
        this._handleRequestClose = this._handleRequestClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onCancel() {
        console.log("Action from dialog submitted...");
        close(this.props);
    }

    onSubmit(){
        if(this.props.createGame){
            this.props.createGame();
        }
    }

    _handleRequestClose() {
        console.log("This happens when the request is closed...");
        close(this.props);
    }

    render() {

        const inputStyle = {
            marginLeft: 20
        };

        let standardActions = [
            <FlatButton
                label="OK"
                primary={true}
                onClick={this.onSubmit}/>,
            <FlatButton
                label="Cancel"
                primary={false}
                onClick={this.onCancel}/>
        ];
        return (
            <Dialog
                title="Create New Game"
                actions={standardActions}
                open={this.props.opened || false}
                onRequestClose={this._handleRequestClose}>
                You have successfully created a new game!
            </Dialog>
        );
    }
}


function mapStateToProps(state, ownProps) {
    if (state && state.getIn) {
        let newGame = state.get("game");
        if(newGame.toJS){
            return Object.assign({}, ownProps, newGame.toJS());
        }
        return {};
    }
    if (state && state.toJS) {
        return state.toJS();
    }
    return state;
}

export default connect(mapStateToProps, { closeDialog, createGame })(NewGameDialog);