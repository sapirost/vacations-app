import React, { Component } from 'react';
import {Link} from "react-router-dom";

class Introduction extends Component {
  render() {
    return (
      <div className="App">
          <div className="introduction part-top">
          <p>Welcom to our vacation's app, 
            <br/>
            this app includes the most updated vacation's deals, 
            the most popular destinations and real time changes. </p>          
          </div>
          <div className="part-bottom">
          <h5> ready to start ? </h5>
          <Link to="/login" className="button">please login</Link>
          <br/>
          <Link id="sign" to="/register">not a member? </Link>
          </div>
      </div>
    );
  }
}

export default Introduction;
