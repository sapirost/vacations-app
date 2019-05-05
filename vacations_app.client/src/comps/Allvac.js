import React, { Component } from 'react';
import { connect } from "react-redux";
import Vacation from './Vacation';
import { Grid } from '@material-ui/core';
import AddVac from './AddVac';
import Dialog from '@material-ui/core/Dialog';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import socketIOClient from "socket.io-client";
import { Loadvac, GetFavorites } from './state/actions';

class Allvac extends Component {
  constructor(props) {
    super(props)
    this.modalHandler = this.modalHandler.bind(this);
    this.followingHandler = this.followingHandler.bind(this);
    this.state = {
      endpoint: "http://localhost:8888",
      openModal: false,
      allVac:[],
      msg: "",
      vacationUpdated: 0
    };
  }

  modalHandler() {
    this.setState({ openModal: !this.state.openModal })
  }

  followingHandler() {
    this.props.getFavorites();
    this.props.loadvac();
  }

  componentDidMount() {
    this.vacHandler(this.props.newState.allVac);
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => {
      this.setState({ msg: "Just Updated !", vacationUpdated: data.vacationID})
      this.props.loadvac();
    });
  }

  vacHandler = vacArray => {
    this.setState({ allVac: vacArray })
  }

  componentWillReceiveProps(newProps) {
    if(newProps.newState.allVac!==this.state.allVac) {
      this.vacHandler(newProps.newState.allVac);
    }
  }

  render() {
    let addButton;
    if (this.props.newState.admin) 
      addButton =  <Fab aria-label="Add" id="addButton" onClick={this.modalHandler}> <AddIcon /> </Fab>

    return (      
      <div className="App">
        <h4>All Vacations</h4>
        <Grid container spacing={16} justify="center" className="fullGrid">
          {this.state.allVac.map(v=> <Vacation  key={v.ID}  v={v} msg={this.state.msg} 
          vUpdated={this.state.vacationUpdated} followingHandler = {this.followingHandler} />  )}
        </Grid>
        {addButton}
        <Dialog id="add-dialog-modal" open={this.state.openModal} onClose={this.modalHandler} aria-labelledby="add-form-dialog-title">
          <AddVac modalHandler = {this.modalHandler}/>
        </Dialog>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {  
  return  { 
      loadvac: function() { 
           return  dispatch(Loadvac());
        },
        getFavorites: username => {
          return dispatch(GetFavorites(username));
        }
      }
  };

  const mapStateToProps = state => { 
    var newState=state;
    return { newState  };
  }; 
 
 
const allvac = connect(mapStateToProps, mapDispatchToProps)(Allvac);
export default allvac;