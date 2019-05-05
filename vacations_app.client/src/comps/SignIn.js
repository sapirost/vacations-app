import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";
import Help from '@material-ui/icons/Help';
import { connect } from "react-redux";
import { Log } from './state/actions';


class SignIn extends Component {
  state= {
    firstname: {valid:false,class:"validate",value:""},
    lastname: {valid:false,class:"validate",value:""},
    username: {valid:false,class:"validate",value:""},
    password: {valid:false,class:"validate",value:""},
    repeatpass: {valid:false,class:"validate",value:""},
    msg:""
  }
  render() {
    return (
      <div className="signin">
        <Link to='/'><Help/></Link>
        <span className="msg">{this.state.msg}</span><br/>
        <h3 className="title">Sign In</h3>
          <div className="row">
            <div className="input-field col s12">
              <input id="firstname" type="text" name="firstname" onClick={this.handleTextChange.bind(this)} 
              onChange={this.handleTextChange.bind(this)} autoComplete="off" className={this.state.firstname.class}/>
              <label htmlFor="firstname">first name</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input id="lastname" type="text" name="lastname" onClick={this.handleTextChange.bind(this)} 
              onChange={this.handleTextChange.bind(this)} autoComplete="off" className={this.state.lastname.class}/>
              <label htmlFor="lastname">last name</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input id="username" type="text" name="username" onClick={this.handleTextChange.bind(this)}
              onChange={this.handleTextChange.bind(this)} autoComplete="off" className={this.state.username.class}/>
              <label htmlFor="username">user name</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input id="password" type="password" name="password" onClick={this.handleTextChange.bind(this)}
              onChange={this.handleTextChange.bind(this)} autoComplete="off" className={this.state.password.class}/>
              <label htmlFor="password">Password</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input id="repeatpass" type="password" name="repeatpass" onClick={this.handlePass.bind(this)}
              onChange={this.handlePass.bind(this)} autoComplete="off" className={this.state.repeatpass.class}/>
              <label htmlFor="repeatpass">repeat password</label>
            </div>
          </div>
          <div className="centered">
            <Button variant="contained" className="button" onClick={this.sign.bind(this)}>Sign</Button>
          </div><br/>
          <Link to="/login">already a member? </Link>
      </div>
    );
  }

  handleTextChange (ev) {
    var obj;
    if (ev.target.value !== "") {
    obj = { valid:true, class:"valid", value:ev.target.value}
  }
    else {
      obj = { valid:false, class:"invalid", value:ev.target.value }
    }
      this.setState({[ev.target.name]:obj});
  }

  handlePass (ev) {
    var obj;
    if (ev.target.value === this.state.password.value) {
      obj = { valid:true, class:"valid", value:ev.target.value }
    }
    else { obj = { valid:false, class:"invalid", value:ev.target.value }
    }
      this.setState({[ev.target.name]:obj});
  }

  async sign() {
    if (this.state.firstname.valid && this.state.lastname.valid
    && this.state.username.valid && this.state.password.valid && this.state.repeatpass.valid) {
      let resp = await fetch('/api/users/signin' , {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      });
      let jsonData = await resp.json();
      if (jsonData.logged) {
        document.getElementsByClassName("App-logo")[0].className = "App-logo-fade";
        setTimeout(()=>{ this.props.dispatchChange(jsonData); }, 2000);
      }
      else {
        this.setState({ "msg": "*user name already exist" }); 
        let obj = {valid:false,class:"invalid",value:this.state.username.value};
        this.setState({username:obj});
      }
    }
    else {
      this.setState({ "msg": "*all fields are required" }); 
      var arr = [...document.getElementsByClassName("validate")];
      arr.forEach (a => { a.className = "invalid" });   
    }
  }
}

const mapDispatchToProps = function(dispatch) {  
  let obj={
      dispatchChange: function(data)
      {
          dispatch(Log(data))
      }
  } 
  return obj;  
}; 

const signIn = connect(null, mapDispatchToProps)(SignIn);
export default signIn;
