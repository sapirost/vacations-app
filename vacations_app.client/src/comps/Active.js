import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Switch,NavLink,Redirect} from "react-router-dom";
import Reports from './Reports';
import { connect } from "react-redux";
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Allvac from './Allvac';
import { Logout, Loadvac, GetFavorites, Session } from './state/actions';
import BarChart from '@material-ui/icons/BarChart';
import Flight from '@material-ui/icons/FlightTakeoffOutlined';

class Active extends Component {
  constructor(props) {
    super(props);
      if(this.props.newState.session) {
        this.props.loadvac();
        this.props.getFavorites();
      }
  }
  state = {
    lastScrollY: 0,
    navStyle :"firstStyle"
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
      this.props.getSession();    
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = event => {
    if (window.scrollY > this.state.lastScrollY) 
      this.setState({navStyle :"secondStyle"});
    else if (window.scrollY < 220)
      this.setState({navStyle :"firstStyle"});
    this.setState({lastScrollY : window.scrollY});
  }

  render() {
    return (      
    <Router basename="start">
      <div className="fullPage" onScroll={this.onScroll}>
        <div className="header-wrapper">
          <header className="heading">
            <nav className="nav-extended" id={this.state.navStyle}>
              <div className="nav-wrapper">
                <div className="nav-content">
                  <ul className="tabs tabs-transparent right" id="pagesMenu">
                  {this.props.newState.admin ? 
                    <li className="tab"><NavLink to="/Reports" activeStyle={{borderBottom:'2.5px solid white' }}>
                  <IconButton disabled><BarChart /></IconButton> reports</NavLink></li>:<li></li> }
                    <li className="tab"><NavLink to="/vacations" activeStyle={{borderBottom:'2.5px solid white' }}>
                    <IconButton disabled><Flight /></IconButton>vacations</NavLink></li>
                  </ul>
                  <ul className="tabs tabs-transparent right" id="staticMenu">
                    <li className="tab" onClick={this.logout.bind(this)}>Sign out</li>
                    <li className="tab">{this.props.newState.admin? "Hello Admin":"Hello " + this.props.newState.username}</li>
                    <li className="tab"><IconButton disabled><AccountCircle /></IconButton></li>
                  </ul>
                </div>
              </div>
            </nav>
          </header>
        </div>
        <div className="content">
          <Switch>
          <Route path="/vacations" render={props => (this.props.newState.session? <Allvac {...props}/>:<Redirect to="/welcome"/>) }/>
            <Route path="/Reports" render={props =>(this.props.newState.session?<Reports {...props}/>:<Redirect to="/welcome"/>) }/>
            <Route exact path="/" render={() => (<Redirect to="/vacations"/>)}/>
          </Switch>
        </div>
      </div>
    </Router>
    );
  }

  logout(event) {
    this.props.dispatchChange()
  }
}

const mapStateToProps = function(state) { 
  var newState=state;
  return { newState  };
}; 

  const mapDispatchToProps = dispatch => {  
    return  { 
        loadvac: function() { 
             return  dispatch(Loadvac());
          },
          getFavorites: () => {
            return dispatch(GetFavorites());
          },
          dispatchChange: () => { 
            return dispatch (Logout()) 
          },
          getSession: function() { 
            return  dispatch(Session());
         }
        }
    };
  
  const active = connect(mapStateToProps, mapDispatchToProps)(Active);
  export default active;