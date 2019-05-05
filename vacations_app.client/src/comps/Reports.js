import React, { Component } from 'react';
import { connect } from "react-redux";
import { Line } from 'react-chartjs-2';

class Reports extends Component {
constructor(props) {
  super (props);
  this.state = {
    chartData: {
      datasets: [{ }]
    }
  }
}

componentDidMount() {
  if(this.props.newState.allVac !== undefined) {
    var labelsArr = [], allVac = this.props.newState.allVac, followersData = [];
    allVac.forEach(v => { 
      labelsArr.push(`ID: ${v.ID} - ${v.destination}`);
      followersData.push(v.followers);
    });

    this.setState({
      chartData: {
        labels: labelsArr,
        datasets: [{
          label:'followers',
          data: followersData,
          borderWidth: 2,
          borderColor: '#26a69a',
          hoverBackgroundColor: '#26a69a',
          backgroundColor: 'transparent'
        }]
      }
    })
  }
}

  render() {
    return (
      <div className="App">
           <Line data={this.state.chartData} options={{
            layout: {
              padding: {
                left:60,
                right:60,
                top:60,
                bottom:60
              }
            },
             title: {
               display: true,
               text: "vacation's reports",
               fontSize:25
             },
             legend: {
               display:true,
               position:"top"
             }
           }} />
      </div>
    );
  }
}

const mapStateToProps = state => { 
  let newState=state;
  return { newState  };
}; 

const reports = connect(mapStateToProps, null)(Reports);
export default reports;
