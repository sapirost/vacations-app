import React, { Component } from 'react';
import airplane from './airplane.png';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Login from './Login';
import SignIn from './SignIn';
import Introduction from './Introduction';
import './css/landpage.css';

class App extends Component {
  render() {
    return ( 
      <div className="row" id="landpage">
      <Router basename="/welcome">
      <div className="col s4" id="asside">
          <Switch>
          <Route exact path='/' component={Introduction} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={SignIn} />
          </Switch>
          </div>
      </Router> 
      <div className="col s8" id="main-div">  
        <h3 className="title">Vacation's Tracking</h3>
        <img src={airplane} className="App-logo" alt="logo" />
      </div> 
      </div>
    );
  }
}

export default App;
