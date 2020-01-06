import React, { Component } from 'react'
import * as lodash from 'lodash';
import '../Style/Common.css'

export default class Dashboard extends Component {
    state={ emp_data : [], Cutoff :'', selectedTab: 0}
    
    componentDidMount(){
        this.fetchData('fetchEmployeePoints');
    }

    render() {

        return (
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                        <button className="btn" onClick={() => {
                            this.setState({
                                emp_data: [],
                                Cutoff: ''
                            }, () => {
                                this.fetchData('updateRecords')
                            });
                        }}>Update</button>
                    </ol>
                </nav>
                <ul className="nav nav-tabs">
                    <li className="nav-item" onClick={() => this.handleChangeTab(0)}>
                        <p className={`nav-link ${this.state.selectedTab === 0 ? 'active' : ''}`} href="#!">Points</p>
                    </li>
                    <li className="nav-item" onClick={() => this.handleChangeTab(1)}>
                        <p className={`nav-link ${this.state.selectedTab === 1 ? 'active' : ''}`} href="#!">Projects</p>
                    </li>
                </ul>
                {
                  this.state.selectedTab === 0 ? this.getPointTable() : this.getProjectTable()
                }
            </div>
        )
    }

    handleChangeTab= (index) => {
        this.setState({
            selectedTab: index
        });
    }

    getProjectTable =() => {
        return (
        <table className="user" width="100%">
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Project type</th>
                            <th>Project status</th>
                            <th>Feedback</th>
                            <th>Point type</th>
                            <th>Allotted Points</th>
                            <th>Kickoff Points</th>
                            <th>Retention Points</th>
                            <th>Timely Delivery Points</th>
                            <th>Post Delivery Cycle Points</th>
                            <th>Total Eligible Points</th>
                            <th>Final Points</th>
                        </tr>
                    </thead>
                    <tbody>

                    {
                    !!this.state.emp_data.length && this.state.emp_data.map((person, index) => {
                        return (
                            <tr key={index}>
                                <td>{person['projectname']}</td>
                                <td>{person['projecttype']}</td>
                                <td>{person['projectstatus']}</td>
                                <td>{person['clientfeedback']}</td>
                                <td>{person['pointtype']}</td>
                                <td>{person['dev1points']}</td>
                                <td>{person['dev1kickoff']}</td>
                                <td>{person['dev1retention']}</td>
                                <td>{person['dev1timelydelivery']}</td>
                                <td>{person['dev1pdcpoints']}</td>
                                <td>{person['dev1eligible']}</td>
                                <td>{person['dev1final']}</td>
                            </tr>
                        )
                    }) 
                }
                {
                    !this.state.emp_data.length &&
                    <tr>
                        <td colSpan={12}>
                    <div className="d-flex justify-content-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    </div>
                        </td>
                    </tr> 
                }

                    </tbody>
                </table>
        )
    }

    getPointTable = () => {
        var sumAlloted = 0;
        var sumKickoff = 0;
        var sumRetention = 0;
        var sumTdp = 0;
        var sumPdc =  0;
        var sumEligible = 0;
        var sumFinal = 0;
        var sumEscaltions = 0;
        var sumEdp = 0;
        var sumBooster =0;

        var cutoffPoint = this.state.Cutoff;
       
        
        if(this.state.emp_data.length > 0){
            this.state.emp_data.map((person, index) => {
                sumAlloted = sumAlloted + parseFloat(person['dev1points']);
                sumKickoff = sumKickoff + parseFloat(person['dev1kickoff']);
                sumRetention = sumRetention + parseFloat(person['dev1retention']);
                sumTdp = sumTdp + parseFloat(person['dev1timelydelivery']);
                sumPdc = sumPdc + parseFloat(person['dev1pdcpoints']);
                sumEligible = sumEligible + parseFloat(person['dev1eligible']);
                sumFinal = sumFinal + parseFloat(person['dev1final']);
                sumEdp = sumFinal*2*(5/100);
                
                if(person['clientfeedback'] === 'Escalation'){
                    sumEscaltions = sumEscaltions + 1 
                };

                if(sumAlloted > (+cutoffPoint.cutoff *5)){
                    sumBooster = sumAlloted*(20/100);
                }else{
                    sumBooster = 0
                }
            });
        }
        return (
            <div>
                {
                    !!this.state.emp_data.length ? (
                        <table className="user dash">
                        <tbody>
                        <tr className="highlight">
                            <th>Name</th>
                            <td>{JSON.parse(localStorage.getItem('authData')).name}</td>
                        </tr>
                        <tr>
                            <th>Your Quarterly Cut-off</th>
                            <td>--</td>
                        </tr>
                        <tr>
                            <th>Allotted Points</th>
                            <td>{Math.round(sumAlloted)}</td>
                        </tr>
                        <tr>
                            <th>Kickoff Points</th>
                            <td>{sumKickoff}</td>
                        </tr>
                        <tr>
                            <th>Retention Points</th>
                            <td>{sumRetention}</td>
                        </tr>
                        <tr>
                            <th>Timely Delivery Points</th>
                            <td>{Math.round(sumTdp)}</td>
                        </tr>
                        <tr>
                            <th>Post Delivery Cycle Points</th>
                            <td>{Math.round(sumPdc)}</td>
                        </tr>
                        <tr>
                            <th>Total Eligible Points</th>
                            <td>{Math.round(sumEligible)}</td>
                        </tr>
                        <tr>
                            <th>Final Points</th>
                            <td>{Math.round(sumFinal)}</td>
                        </tr>
                        <tr>
                            <th>Cuttoff</th>
                            <td>{+cutoffPoint.cutoff}</td>
                        </tr>
                        <tr>
                            <th>Number of Escalations</th>
                            <td>{sumEscaltions}</td>
                        </tr>
                        <tr>
                            <th>Escalation Deduction Points</th>
                            <td>{Math.round(sumEdp)}</td>
                        </tr>
                        <tr>
                            <th>Efficiency Booster</th>
                            <td>{Math.round(sumBooster)}</td>
                        </tr>
                        <tr className="highlight">
                            <th>Payable Points</th>
                            <td>{Math.round(sumFinal - (cutoffPoint.cutoff) - sumEdp + sumBooster)}</td>
                        </tr>
                        </tbody>
                    </table>
                    ):
                     (<div className="d-flex justify-content-center">
                     <div className="spinner-border text-success" role="status">
                         <span className="sr-only">Loading...</span>
                     </div>
                     </div>)
                }
            </div>
        )
    }

    fetchData = (endpoint) => {
        fetch(`http://172.16.3.188:8000/${endpoint}`)
        .then(response => response.json())
        .then(data => {
          if(localStorage.getItem('authData')) {            
            const  particularEmployee = lodash.filter(data.data.projects , emp => emp.dev1name.toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase());
            const particularCutoff = lodash.find(data.data.cutOff, (emp) => emp.developer.toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())
             this.setState({
                 emp_data: particularEmployee,
                 Cutoff : particularCutoff
            });                                  
          }
        })
        .catch(error => console.error(error))
    }
}
