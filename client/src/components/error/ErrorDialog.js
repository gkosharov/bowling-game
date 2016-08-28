/**
 * Created by g.kosharov on 28.8.2016
 */
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {dismissError} from '../../actions/Error'


function close(props) {
    if (props.dismissError) {
        props.dismissError({opened: false});
    }
}
class ErrorDialog extends Component {
    constructor(props) {
        super(props);
        this._handleRequestClose = this._handleRequestClose.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        console.log("Action from dialog submitted...");
        close(this.props);
    }

    _handleRequestClose() {
        console.log("This happens when the request is closed...");
        close(this.props);
    }

    render() {
        let standardActions = [
            <FlatButton
                label="OK"
                primary={true}
                onClick={this.handleClose}/>
        ];
        return (
            <Dialog
                title="ERROR"
                actions={standardActions}
                open={this.props.opened || false}
                onRequestClose={this._handleRequestClose}>
                {this.props.message || "GENERAL FAILURE!"}
            </Dialog>
        );
    }
}


function mapStateToProps(state) {
    if (state && state.getIn) {
        let errors = state.getIn(["errors"]);
        if(errors.toJS){
            return errors.toJS();
        }
        return {};
    }
    if (state && state.toJS) {
        return state.toJS();
    }
    return state;
}

export default connect(mapStateToProps, {dismissError})(ErrorDialog);