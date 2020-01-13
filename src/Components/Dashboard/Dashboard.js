import React, { Component } from 'react'
import * as lodash from 'lodash';
import '../../Style/Common.css';
import Tabletop from "tabletop";
import { throwStatement } from '@babel/types';
import { REFUSED } from 'dns';


const devKeys = ['Dev1', 'Dev2', 'Dev3','Dev4','Dev5','Dev6','Expert','PC1','PC2']
export default class Dashboard extends Component {
    state={ emp_data : [], Cutoff :'', selectedTab: 0, feasibilityPoint : [], delights:[], quotes : []}

    componentDidMount(){

        Tabletop.init({ key: 'https://docs.google.com/spreadsheets/d/1LiWlQHawZaLkaN7S_YMTlvg-CEQfBQ-EaO4nVDHda3Y/edit#gid=0',
        callback: data=>{
            if(localStorage.getItem('authData')) {
                const particularEmployee = [];
                var particularDeights;
                var particularFeasiblepoint;
                var particularQuotes;
                data.Projects.elements.forEach((obj) => {
                    return devKeys.forEach((str)=>{                
                        if(obj[`${str} Name`] !== '' &&  (obj[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {                           
                            return particularEmployee.push(obj);
                        }
                    });
                })

                const particularCutoff = lodash.find(data.Cutoff.elements, (emp) => emp.Developer.toString().toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())
                
               

                data.Projects.elements.forEach((obj)=>{
                    return devKeys.forEach((str)=>{                        
                        if(obj[`${str} Name`] !== '' && (obj[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())){
                            console.log(str);
                            if(str == 'PC1' || str == 'PC2'){
                                particularDeights = lodash.filter(data.Delights.elements, (emp) => emp["Brought By"].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())
                                particularQuotes = lodash.filter(data.Quotes.elements, (emp) => emp["Quote Prepared By"].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())
                                // return particularDelights.push(obj);
                            }else{
                                console.log('Dev point table')
                                // return particularFeasiblity.push(obj)
                                particularFeasiblepoint = lodash.filter(data.Quotes.elements, (emp) => emp["Feasibility Checked By (If Developer)"].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())
                            }
                        }
                    })                    
                })
                
                this.setState({
                  emp_data: particularEmployee,
                  Cutoff: particularCutoff,
                  feasibilityPoint : particularFeasiblepoint,
                  delights: particularDeights,
                  quotes:particularQuotes
                })
            }
        }});
        

    }

    render() {
        console.log(this.state.delights);
        return (
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                    </ol>
                </nav>
                <ul className="nav nav-tabs">
                    <li className="nav-item" onClick={() => this.handleChangeTab(0)}>
                        <p className={`nav-link ${this.state.selectedTab === 0 ? 'active' : ''}`} href="#!">Points</p>
                    </li>
                    <li className="nav-item" onClick={() => this.handleChangeTab(1)}>
                        <p className={`nav-link ${this.state.selectedTab === 1 ? 'active' : ''}`} href="#!">Projects</p>
                    </li>                    
                    <li className="nav-item" onClick={() => this.handleChangeTab(2)}>
                        {this.state.feasibilityPoint? (<p className={`nav-link ${this.state.selectedTab === 2 ? 'active' : ''}`} href="#!">Feasibility</p>) : (<p className={`nav-link ${this.state.selectedTab === 2 ? 'active' : ''}`} href="#!">Delights</p>) }                        
                    </li>
                    {this.state.delights ? (
                        <li className="nav-item" onClick={() => this.handleChangeTab(3)}>
                        <p className={`nav-link ${this.state.selectedTab === 3 ? 'active' : ''}`} href="#!">Quotes</p>
                    </li>
                    ): null}
                </ul>
                {
                    this.state.selectedTab === 0 ? this.getPointTable() : this.state.selectedTab === 1 ? this.getProjectTable() : this.state.selectedTab === 3 ? this.getQuotesPoint() :this.state.feasibilityPoint ? this.getFeasibilitytable() : this.getDelightPoint()
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
                            <th>Sr</th>
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
                                 <td>{index  + 1}</td>
                                <td>{person['Project Name']}</td>
                                <td>{person['Project Type']}</td>
                                <td>{person['Project Status']}</td>
                                <td>{person['Client Feedback']}</td>
                                <td>{person['Point Type']}</td>
                                <td>{
                                    devKeys.map((str)=>{
                                        if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {                                                                                       
                                            return person[`${str} Points`];
                                        }
                                    })
                                }</td>
                                <td>{
                                    devKeys.map((str)=>{
                                        if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {
                                            return person[`${str} Kickoff`];
                                        }
                                    })
                                }</td>
                                <td>{
                                    devKeys.map((str)=>{
                                        if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {
                                            return person[`${str} Retention`];
                                        }
                                    })
                                }</td>
                                <td>{
                                    devKeys.map((str)=>{
                                        if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {
                                            return person[`${str} TImely Delivery`];
                                        }
                                    })
                                }</td>
                                <td>{
                                    devKeys.map((str)=>{
                                        if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {
                                            return person[`${str} PDC Points`];
                                        }
                                    })
                                }</td>
                                <td>{
                                    devKeys.map((str)=>{
                                        if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {
                                            return person[`${str} Eligible`];
                                        }
                                    })
                                }</td>
                                <td>{
                                    devKeys.map((str)=>{
                                        if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {
                                            return person[`${str} Final`];
                                        }
                                    })
                                }</td>
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

    sum = (input)=>{
             
        if (toString.call(input) !== "[object Array]")
           return false;
             
                   var total =  0;
                   for(var i=0;i<input.length;i++)
                     {                  
                       if(isNaN(input[i])){
                       continue;
                        }
                         total += Number(input[i]);
                      }
                    return total;
                   }

    getPointTable = () => {
        const allocated = [];
        const kickoff = [];
        const retention = [];
        const timelydelivery = [];
        const postdeliverypoint = [];
        const eligiblepoint = [];
        const finalpoint = [];
        const finalsum = []
        var cutoffPoint = this.state.Cutoff;
        var escaltions = 0
        if(this.state.emp_data.length > 0){
            this.state.emp_data.map((person, index) => {                
                devKeys.map((str)=>{
                    if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {                                                                                       
                        return allocated.push(person[`${str} Points`])          
                    }
                })

                devKeys.map((str)=>{
                    if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {            
                        return kickoff.push(person[`${str} Kickoff`])          
                    }
                })

                devKeys.map((str)=>{
                    if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {                                                                                                                              
                        return retention.push(person[`${str} Retention`])          
                    }
                })

                devKeys.map((str)=>{
                    if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {                                                                                                                              
                        return timelydelivery.push(person[`${str} TImely Delivery`])          
                    }
                })

                devKeys.map((str)=>{
                    if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {                                                                                                                              
                        return postdeliverypoint.push(person[`${str} PDC Points`])          
                    }
                })

                devKeys.map((str)=>{
                    if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {                                                                                                                              
                        return eligiblepoint.push(person[`${str} Eligible`])          
                    }
                })

                devKeys.map((str)=>{
                    if(person[`${str} Name`] !== '' &&  (person[`${str} Name`].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase())) {                                                                                                                              
                        return finalpoint.push(person[`${str} Final`])          
                    }
                })
               
                
                if(person['Client Feedback'] === 'Escalation'){
                    escaltions = escaltions + 1 
                };
            });
        }

        // console.log(this.state.feasibilityPoint)

        const feasibilitypoint = [];
        if(this.state.feasibilityPoint && this.state.feasibilityPoint.length > 0){
            this.state.feasibilityPoint.map((person,index)=>{
                feasibilitypoint.push(person["Feasibility Points"])
            })
        }

        const quotesPoint = [];
        if(this.state.quotes && this.state.quotes.length > 0){
            this.state.quotes.map((person,index)=>{
                quotesPoint.push(person["Quote Points"])
            })
        }

        const testimonyPoint=[];
        if(this.state.delights && this.state.delights.length > 0){
            this.state.delights.map((person, index) => {
                testimonyPoint.push(person["Testimony Points"]);
            })
        }
        
        console.log(testimonyPoint);

        finalpoint.forEach(function(el,i){
            finalsum.push(el.split(',').join(''))
        })

        const totalFinalpoint = this.sum(finalsum);

        const totalAlloted = this.sum(allocated);
        const totalKickoff = this.sum(kickoff)
        const totalRetention = this.sum(retention)
        const totalTDpoint = this.sum(timelydelivery)
        const totalPdc = this.sum(postdeliverypoint)
        const totalEligiblepoint = this.sum(eligiblepoint)
        var totalBooster = 0;
        var totalEdp = totalFinalpoint*escaltions*(5/100);
        var totalFeasibilitypoint = this.sum(feasibilitypoint);
        var totalQuotespoint = this.sum(quotesPoint);
        var totalTestymonypoint = this.sum(testimonyPoint);
        if(totalAlloted > (cutoffPoint.Cutoff *5)){
            totalBooster = totalAlloted*(20/100);
        }else{
            totalBooster = 0
        }

        console.log(totalFeasibilitypoint);
        

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
                            <td>{cutoffPoint.Cutoff}</td>
                        </tr>
                        <tr>
                            <th>Allotted Points</th>
                            <td>{Math.round(totalAlloted)}</td>
                        </tr>
                        <tr>
                            <th>Kickoff Points</th>
                            <td>{Math.round(totalKickoff)}</td>
                        </tr>
                        <tr>
                            <th>Retention Points</th>
                            <td>{Math.round(totalRetention)}</td>
                        </tr>
                        <tr>
                            <th>Timely Delivery Points</th>
                            <td>{Math.round(totalTDpoint)}</td>
                        </tr>
                        
                        <tr>
                            <th>Post Delivery Cycle Points</th>
                            <td>{Math.round(totalPdc)}</td>
                        </tr>

                        {this.state.delights ?
                            (
                            <tr>
                                <th>Quote Points</th>
                                <td>{Math.round(totalQuotespoint)}</td>
                            </tr>
                            )
                            :
                            null
                        }                       

                        <tr>
                            {this.state.feasibilityPoint ?
                                (
                                    <React.Fragment>
                                    <th>Feasibility Points</th>
                                    <td>{Math.round(totalFeasibilitypoint)}</td>
                                    </React.Fragment>
                                )
                                :
                                (
                                    <React.Fragment>
                                        <th>Testimony Points</th>
                                        <td>{Math.round(totalTestymonypoint)}</td>
                                    </React.Fragment>
                                )
                            }                           
                           </tr>                    
                        <tr>
                            <th>Total Eligible Points</th>
                            <td>{Math.round(totalEligiblepoint)}</td>
                        </tr>
                        <tr>
                            <th>Final Points</th>
                            <td>{Math.round(totalFinalpoint)}</td>
                        </tr>
                        <tr>
                            <th>Cuttoff</th>
                            <td>{cutoffPoint.Cutoff}</td>
                        </tr>
                        <tr>
                            <th className="makered">Number of Escalations</th>
                            <td className="makered">{escaltions}</td>
                        </tr>
                        <tr>
                            <th className="makered">Escalation Deduction Points</th>
                            <td className="makered">{Math.round(totalEdp)}</td>
                        </tr>
                        <tr>
                            <th>Efficiency Booster</th>
                            <td>{Math.round(totalBooster)}</td>
                        </tr>
                        {this.state.delights?(
                            <tr className="highlight">
                                <th>Payable Points</th>
                                <td>{Math.round(totalFinalpoint - (cutoffPoint.Cutoff) - totalEdp + totalBooster + totalQuotespoint + totalTestymonypoint)}</td>
                            </tr>
                        ):(
                            <tr className="highlight">
                                <th>Payable Points</th>
                                <td>{Math.round(totalFinalpoint - (cutoffPoint.Cutoff) - totalEdp + totalBooster + totalFeasibilitypoint)}</td>
                            </tr>
                        )}
                        
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

    getFeasibilitytable = () => {
        console.log(this.state.feasibilityPoint)
        return(
            <table className="user" width="100%">
            <thead>
                <tr>
                    <th>Sr</th>
                    <th>Quote Id</th>                    
                    <th>Hrs Invested</th>
                    <th>Feasibility Points</th>
                </tr>
            </thead>
            <tbody>

            {
            !!this.state.feasibilityPoint && this.state.feasibilityPoint.map((person, index) => {
                return (
                    <tr key={index}>
                         <td>{index  + 1}</td>
                        <td>{person['Quote Id']}</td>                        
                        <td>{person['Hrs Invested']}</td>
                        <td>{person['Feasibility Points']}</td>
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

    getDelightPoint =() =>{
        console.log('Delight Point Table here')
        return(
            <table className="user" width="100%">
            <thead>
                <tr>
                    <th>Sr</th>
                    <th>Client Name </th>
                    <th>Agency Name</th>                   
                    <th>Testimony Type</th>
                    <th>Testimony Points</th>
                </tr>
            </thead>
            <tbody>

            {
            !!this.state.delights && this.state.delights.map((person, index) => {
                return (
                    <tr key={index}>
                         <td>{index  + 1}</td>
                        <td>{person['Client Name']}</td>
                        <td>{person['Agency Name']}</td>                       
                        <td>{person['Testimony Type']}</td>
                        <td>{person['Testimony Points']}</td>
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
    
    getQuotesPoint = () =>{
        console.log(this.state.quotes);
        
        return(
            <table className="user" width="100%">
            <thead>
                <tr>
                    <th>Sr</th>
                    <th>Quote Id </th>
                    <th>Quote Cost (Std)</th>
                    <th>Quote Status</th>                    
                    <th>Quote Points</th>
                </tr>
            </thead>
            <tbody>

            {
            !!this.state.quotes && this.state.quotes.map((person, index) => {
                return (
                    <tr key={index}>
                         <td>{index  + 1}</td>
                        <td>{person['Quote Id']}</td>
                        <td>{person['Quote Cost (Std)']}</td>
                        <td>{person['Quote Status']}</td>                       
                        <td>{person['Quote Points']}</td>
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
}