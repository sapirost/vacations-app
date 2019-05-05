import React, { Component } from 'react';
import { BrowserRouter as Router, Route,Redirect} from "react-router-dom";
import LandPage from './comps/LandPage';
import Active from './comps/Active';
import { connect } from "react-redux";
import { Session } from './comps/state/actions';


class App extends Component {
  componentDidMount() {
    this.props.getSession();
  }
 
  render() {
    return (
      <Router>
      <div className="App">
      <Route exact path="/" render={() => (this.props.newState.session? (<Redirect to="/start"/>) : (<Redirect to="/welcome"/>))}/>
      <Route path="/start" render={() => (this.props.newState.session? (<Active/>) : (<Redirect to="/welcome"/>))}/>
      <Route path="/welcome" render={() => (this.props.newState.session? (<Redirect to="/"/>) : (<LandPage />))}/>
      <Route path="/active" render={() => (this.props.newState.session? (<Active />) : (<Redirect to="/"/>))}/>
      </div>
      </Router>
    );
  }
}

const mapDispatchToProps = dispatch => {  
  return  { 
      getSession: function() { 
           return  dispatch(Session());
        }
      }
  };

const mapStateToProps = state => { 
  let newState=state;
  return { newState  };
}; 

const app = connect(mapStateToProps, mapDispatchToProps)(App);
export default app;
