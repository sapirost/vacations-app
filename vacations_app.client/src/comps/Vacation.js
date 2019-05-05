import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Info from '@material-ui/icons/Info';
import DateRange from '@material-ui/icons/DateRange';
import AttachMoney from '@material-ui/icons/AttachMoney';
import { Grid } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import Clear from '@material-ui/icons/Clear';
import { connect } from "react-redux";
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import AddVac from './AddVac';
import Dialog from '@material-ui/core/Dialog';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class Vacation extends Component {
  constructor(props) {
    super(props)
    this.modalHandler = this.modalHandler.bind(this)
    this.state = {
      openModal: false,
      value: 1,
      msg: "",
      followedVac: false
    }
  }

  modalHandler() {
    this.setState({ openModal: !this.state.openModal })
  }

  followHandler(newProps) {
    let favoritesArrayCopy = newProps.newState.favoritesArray;
    if(favoritesArrayCopy!==undefined) {
      let found = favoritesArrayCopy.find (f => { return this.props.v.ID === f });
      if (found !== undefined)
        this.setState({followedVac: true}); 
      else
        this.setState({followedVac: false});       
      }
  }

  handleTabChange = (event, value) => {
    this.setState({ value });
  };
  handleFollowChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  componentDidUpdate(prevProps) {
    if(prevProps!==this.props) {
      if (this.props.msg !== undefined && this.props.msg !== "" && this.props.vUpdated === this.props.v.ID) {
        let date = new Date();
        document.getElementById('vacation'+this.props.v.ID).className = "card updated-vac";
        this.setState({ msg: this.props.msg + '  -  ' + date.getHours() + ':' + date.getMinutes() });
      }
    }
  }

  componentWillReceiveProps(newProps) {
    if(newProps.newState.favoritesArray!==this.props.newState.favoritesArray)
      this.followHandler(newProps);
}

componentDidMount() {
  this.followHandler(this.props);
}

  render() {
    const { value } = this.state;
    let editButton;

    if (this.props.newState.admin) {
      editButton = <Fab size="small" aria-label="Add" onClick={this.modalHandler} className="btn-floating halfway-fab teal lighten-1"> 
      <EditIcon /> </Fab>;
    }

    return (
      <Grid item>
        <div className="card" id={'vacation'+this.props.v.ID}>
          <div className="card-image">
          {this.props.newState.admin ? 
            <Clear className="deleteIcon"
            onClick={ e => { if (window.confirm('Are you sure you want to delete this item?')) { this.deleteVac(e)}; } }/>
            : 
            <FormControlLabel  className="followIcon" control={
            <Checkbox disableRipple icon={<FavoriteBorder />} checkedIcon={<Favorite />} 
            checked={this.state.followedVac} 
          onChange={this.handleFollowChange("followedVac")} onClick={this.followAction.bind(this)}
          value="followedVac"
            name="followedVac" /> } /> }
            <img src={'/api/vacations/getimg/'+this.props.v.image} alt=""/>
            <span className="card-title">{this.props.v.destination}</span>
            {editButton}
          </div>
          <div className="card-content">
          {this.state.msg}
            <Tabs className="cardTabs" value={value} onChange={this.handleTabChange} indicatorColor="primary">
              <Tab className="singleTab" label="price" value={1} icon={<AttachMoney />} />
              <Tab label="dates" value={2} icon={<DateRange />} />
              <Tab label="description" value={3} icon={<Info />} />
            </Tabs>
            {value === 1 && <TabContainer className="tabContain">{this.props.v.price} $</TabContainer>}
            {value === 2 && <TabContainer className="tabContain">{this.props.v.startDate} - {this.props.v.endDate}</TabContainer>}
            {value === 3 && <TabContainer className="tabContain">{this.props.v.description}</TabContainer>}
          </div>
        </div>
        <Dialog id="dialog-modal" open={this.state.openModal} onClose={this.modalHandler} aria-labelledby="form-dialog-title">
        <AddVac vacation={this.props.v} modalHandler = {this.modalHandler}/>
        </Dialog>
      </Grid>
    );
  }

  followAction () { 
    let following;
    if (!this.state.followedVac)
      following = 'increase';
    else
      following = 'decrease';

    fetch('/api/vacations/updatefollowers', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        following: following, 
        vacationID: this.props.v.ID, 
      })
    }).then(r=>r.json())
    .then(data=> {
      this.setState({followedVac: !this.state.followedVac});
      this.props.followingHandler();
    })
    .catch (err => {
      console.log(err)
    })
  }

  deleteVac(ev) {
    fetch('/api/vacations/deletevac', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'id': this.props.v.ID})
    }).then( res => { 
        alert("vacation deleted")
        this.props.loadvac();
      }).catch(err => {
        console.log(err)
      })
  }
}

  const mapStateToProps = state => { 
    var newState=state;
    return { newState  };
  }; 

const vacation = connect(mapStateToProps, null)(Vacation);
export default vacation;