import React, { Component } from 'react';
import Materialize from "materialize-css";
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import AttachMoney from '@material-ui/icons/AttachMoney';
import axios from 'axios';
import { connect } from "react-redux";
import { Loadvac } from './state/actions';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

class AddVac extends Component {
  constructor(props) {
    super(props);
      this.textInputStart = null;
      this.setInputStartRef = element => {
        this.textInputStart = element;
        this.addStartPicker(element);
    };
  }

  state = {
    destination: { valid:false, class:"validate", value:"" },
    description: { valid:false, class:"validate", value:"" },
    price: { valid:false, class:"validate", value:"" },
    image: "",
    startDate: { valid:true,class:"validate", value:"" },
    endDate: { valid:true ,class:"validate", value:"" },
    msg:"",
    selectedFile: null,
    editor: {is: false, id: 0}
  };

  addingVac = () => {
    const data = new FormData(document.querySelector("#vacation_form"));
    if (!this.state.editor.is) {
      axios.post("/api/vacations/addvac", data, { 
      }).then( res => { 
      alert("vacation added")
      this.props.loadvac();
      this.props.modalHandler();   
      }).catch(err => {
        alert("oops! failed adding")
      })  
    }
    else {
      data.append("vacationID", parseInt(this.state.editor.id))
      if(this.state.selectedFile == null)
        data.append("imgShown", this.props.vacation.image)
      axios.post("/api/vacations/updatevac", data, { 
      }).then( res => { 
      alert("vacation updated")
      this.props.loadvac(); 
      this.props.modalHandler(); 
      }).catch(err => {
        alert("oops! failed updating")
      })  
    }
  }
  
  addStartPicker = element => {
    var context = this;
    Materialize.Datepicker.init(element, {
      minDate: new Date(),
      autoClose: true,
      format: 'mmm dd, yyyy',
      onClose: () => {
        let elem = document.getElementById("endDate");
        if (Materialize.Datepicker.getInstance(elem)!== undefined)
          Materialize.Datepicker.getInstance(elem).destroy();

        if (element.value !== "") {
          elem.removeAttribute("disabled");
          context.addEndPicker(elem, element.value);
          context.setState({ 'startDate':{valid:true,class:"valid",value:element.value} });
        }
        else {
          document.getElementById("endDate").setAttribute("disabled");
          context.setState({ 'startDate':{valid:false,class:"invalid",value:element.value} });
        }
      }
  })
}

addEndPicker = (element, mindate) => {
  var context = this;
  Materialize.Datepicker.init(element, {
    minDate: new Date(mindate) ,
    autoClose: true,
    format: 'mmm dd, yyyy',
    onClose: () => {
      if (element.value === "")
        context.setState({ endDate:{valid:false,class:"invalid",value: element.value} });
      else
        context.setState({ endDate:{valid:true,class:"valid",value: element.value} });
    }
  })
}

  componentDidMount() {
    
    if (this.props.vacation !== undefined ) {
      document.getElementById("endDate").removeAttribute("disabled");
      this.setState({
        destination: { valid:true, class:"valid", value:this.props.vacation.destination },
        description: { valid:true, class:"valid", value:this.props.vacation.description },
        price: { valid:true, class:"valid", value:this.props.vacation.price },
        image: '/api/vacations/getimg/' + this.props.vacation.image,
        startDate: { valid:true, class:"valid", value:this.props.vacation.startDate },
        endDate: { valid:true ,class:"valid",value:this.props.vacation.endDate },
        selectedFile: null,
        editor: {is: true, id: this.props.vacation.ID}
      });
    }
 }
  render() {
    return (
      <form id="vacation_form" method="post" onSubmit={this.checkValid.bind(this)} >
        <DialogTitle id="form-dialog-title">New Vacation Deal</DialogTitle>
        <DialogContent>
          <div className="row">
            <div className="input-field col s6">
              <input  id="destination" type="text" className={this.state.destination.class} autoComplete="off" value={this.state.destination.value} 
              name="destination" onClick={this.handleTextChange.bind(this)} onChange={this.handleTextChange.bind(this)} />
              <label htmlFor="destination">Destination</label>
            </div>
            <div className= "col s6 inputNum">
              <AttachMoney  />
              <div className="input-field" >
                <input id="price" type="number" className={this.state.price.class} autoComplete="off" min={0} value={this.state.price.value} 
                name="price" onClick={this.handleTextChange.bind(this)} onChange={this.handleTextChange.bind(this)} />
                <label htmlFor="price">Price</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input id="description" type="text" className={this.state.description.class} autoComplete="off" name="description"
               onChange={this.handleTextChange.bind(this)} value={this.state.description.value} />
              <label htmlFor="description">Description</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s6" id="dates">
              <span className="label">from</span>
              <input  id="startDate" type="text" className={this.state.startDate.class + " datepicker dateset"} ref={this.setInputStartRef} 
              name="startDate" autoComplete="off" value={this.state.startDate.value} onChange={this.handleTextChange.bind(this)}/>
            </div>
            <div className="input-field col s6">
              <span className="label">to</span>
              <input id="endDate" type="text" className={this.state.endDate.class + " datepicker dateset"} disabled
              autoComplete="off" name="endDate" value={this.state.endDate.value} onChange={this.handleTextChange.bind(this)} />
            </div>
          </div>
          <div className="file-field row">
            <div className="col">
              <IconButton component="span"> <PhotoCamera /> </IconButton>
              <input type="file" accept="image/*" name="file" onChange={this.handleCapture.bind(this)}/>
            </div>
            <div className="fileName">
              <input placeholder="Add Image" type="text" className="file-path"/>
            </div>
          </div>
          <div className="row center"><img src={this.state.image} alt="" id="imgShown" name="imgShown"/></div>
        </DialogContent>
        <DialogActions>
          <Button onClick = {this.props.modalHandler}> Cancel </Button>
          <Button type="submit"> Add </Button>
        </DialogActions>
      </form> 
    );
  }

  handleCapture (event) {
    this.setState({ selectedFile: event.target.files[0] });
    var reader = new FileReader();
    var file = event.target.files[0];
    
    reader.readAsDataURL(file);
    reader.onload = event => {
      this.setState({"image":reader.result});
    };
  }
  
  handleTextChange (ev) {
    var obj;
    if (ev.target.value !== "")
      obj = { valid:true, class:"valid", value:ev.target.value }
    else 
      obj = { valid:false, class:"invalid", value:ev.target.value }
    this.setState({[ev.target.name]:obj});
  }

  checkValid(e) {
    e.preventDefault(); 
    if (this.state.destination.valid && this.state.description.valid && this.state.price.valid
    && this.state.startDate.valid && this.state.endDate.valid && (this.state.selectedFile !== null || this.state.image.length > 0)) {
      this.addingVac();
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
    loadvac: function() { 
      return  dispatch(Loadvac());
    }
  }
};

  const mapStateToProps = state => { 
    return { admin: state.admin };
  }; 

const addVac = connect(mapStateToProps, mapDispatchToProps)(AddVac);
export default addVac;