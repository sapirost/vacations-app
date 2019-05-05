import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";
import Help from '@material-ui/icons/Help';
import { connect } from "react-redux";
import { Log } from './state/actions';


class Login extends Component {
  state= {
    username: {valid:false,class:"validate",value:""},
    password: {valid:false,class:"validate",value:""},
    msg:""
  }
  render() {
    return (
      <div className="login">
      <Link to='/'><Help/></Link>
      <span className="msg">{this.state.msg}</span>
      <br/>
        <h3 className="title">Login</h3>
        <div className="row">
        <div className="input-field col s12">
          <input id="username" type="text" className={this.state.username.class} autoComplete="off" name="username"
          onClick={this.handleTextChange.bind(this)} onChange={this.handleTextChange.bind(this)} />
          <label htmlFor="username">user name</label>
        </div>
      </div>
        <div className="row">
        <div className="input-field col s12">
          <input id="password" type="password" className={this.state.password.class} autoComplete="off" name="password"
          onClick={this.handleTextChange.bind(this)} onChange={this.handleTextChange.bind(this)}/>
          <label htmlFor="password">Password</label>
        </div>
      </div>
          <div className="centered">
          <Button variant="contained" className="button" onClick={this.log.bind(this)}>Login</Button>
          </div>
          <br/>
          <Link to="/register">not a member? </Link>
      </div>
    );
  }

  handleTextChange (ev) {
    var obj;
    if (ev.target.value !== "") {
      obj = { valid:true, class:"valid", value:ev.target.value }
    }
    else {
      obj = { valid:false, class:"invalid", value:ev.target.value }
    }
    this.setState({[ev.target.name]:obj});
  }

  async log() {
    if (this.state.username.valid && this.state.password.valid) {
      let resp = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      });
      let jsonData = await resp.json();
      if (jsonData.user.logged) {
        document.getElementsByClassName("App-logo")[0].className = "App-logo-fade";
        setTimeout(()=>{
           this.props.dispatchChange(jsonData.user); 
          }, 2000);
      }
      else {
        this.setState({ "msg": "*user does not exist" }); 
      }
    } 
    else {
      this.setState({ "msg": "*all fields are required" }); 
      var arr = [...document.getElementsByClassName("validate")];
      arr.forEach (a => { a.className = "invalid" });    
    }
  }
}

const mapDispatchToProps = dispatch => {  
  return { 
    dispatchChange: data => { 
      return  dispatch(Log(data));
    }
  }
}; 

const login = connect(null, mapDispatchToProps)(Login);
export default login;
