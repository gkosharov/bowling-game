/**
 * Created by g.kosharov on 28.8.2016
 */
import React, {Component} from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/RaisedButton'
import isString from 'lodash/lang/isString'
import { push } from 'react-router-redux'
import centerComponent from 'react-center-component';

import { connect } from 'react-redux'
import {requestSignin, setCredentials} from '../../actions/Authentication'

@centerComponent class Signin extends Component {
    constructor(props) {
        super(props);
    }

    onSubmit(event) {
        event.preventDefault();

        const username = this.props.username;
        const pass = this.props.password;
        const fullName = this.props.fullName;

        this.props.requestSignin();

    }
    onCancel(event){
        event.preventDefault();

        this.props.push("/");
    }
    onChange(credentialType, event) {
        var value = event.currentTarget.value;
        if (typeof value != "undefined" && isString(value) && this.props.setCredentials) {
            this.props.setCredentials(credentialType, value);
        }
    }

    render() {
        const {topOffset, leftOffset} = this.props;

        const style = {
            position: 'absolute',
            width: 500,
            top: this.props.topOffset,
            left: this.props.leftOffset
        };
        const inputStyle = {
            marginLeft: 20
        };
        const buttonStyle = {
            margin: 12
        };
        return (
            <div style={style}>
                <Paper zDepth={2}>
                    <TextField hintText="User" style={inputStyle} underlineShow={true}
                               value={this.props.username ? this.props.username : ""}
                               onChange={this.onChange.bind(this, "username")}/>

                    <TextField hintText="Pass" style={inputStyle} underlineShow={true}
                               value={this.props.password ? this.props.password : ""}
                               onChange={this.onChange.bind(this, "password")}/>
                    <TextField hintText="Full Name" style={inputStyle} underlineShow={true}
                               value={this.props.fullName ? this.props.fullName : ""}
                               onChange={this.onChange.bind(this, "fullName")}/>
                    <Divider />
                    <Button label="Sign in" primary={true} style={buttonStyle} onClick={this.onSubmit.bind(this)} />
                    <Button label="Cancel" onClick={this.onCancel.bind(this)} style={buttonStyle} />
                </Paper>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    var props = {};
    var login = state.get("login");
    if (login) {
        props.username = login.get("username");
        props.password = login.get("password");
        props.fullName = login.get("fullName");
    }

    return Object.assign({}, ownProps, props);
}


export default connect(mapStateToProps, {requestSignin, push, setCredentials})(Signin);
