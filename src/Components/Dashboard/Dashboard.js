import React, { Component } from 'react'
import * as lodash from 'lodash';
import '../../Style/Common.css';
import Tabletop from "tabletop";
import $ from 'jquery';
import { throwStatement } from '@babel/types';
import { REFUSED } from 'dns';
import  loader  from '../../img/loader.png'

let empList, sortedEmpList;
const devKeys = ['Dev1', 'Dev2', 'Dev3', 'Dev4', 'Dev5', 'Dev6', 'Expert', 'PC1', 'PC2'];
export default class Dashboard extends Component {
    state = {
        employees: [], emp_data: [], filteredEmployee: [], Cutoff: [], selectedTab: 0, feasibilityPoint: [], sheetData: {},
        delights: [], quotes: [], searching: '', isAdmin: false, isModalOpen: false, search: '', isEmpSelected: false, error_msg: '', not_found: '', dataToSort: [], sorted: false, asc: false, tempSort: true
    }

    getParticularEmployee = (name, data, particularEmployee) => {
        data.Projects.elements.forEach((obj) => {
            return devKeys.forEach((str) => {
                if (obj[`${str} Name`] !== '' && (obj[`${str} Name`].toLowerCase() === name)) {
                    return particularEmployee.push(obj);
                }
            });
        });
        return particularEmployee;
    }

    getParticularCutoff = (name, data, objCuttoff) => {
        // console.log(data.Employees.elements)
        // cutoff se ni employee se get krna h Developer me changes h
        objCuttoff.particularCutoff = lodash.find(data.Employees.elements, (emp) =>  emp.Employee.toString().toLowerCase() === name.toLowerCase());
        return objCuttoff;
    }
    

    getOtherData = (name, data, object) => {
        data.Projects.elements.forEach((obj) => {
            return devKeys.forEach((str) => {
                if (obj[`${str} Name`] !== '' && (obj[`${str} Name`].toLowerCase() === name)) {
                    if (str == 'PC1' || str == 'PC2') {
                        object.particularDeights = lodash.filter(data.Delights.elements, (emp) => emp["Brought By"].toLowerCase() === name)
                        object.particularQuotes = lodash.filter(data.Quotes.elements, (emp) => emp["Quote Prepared By"].toLowerCase() === name)

                    } else {
                        object.particularFeasiblepoint = lodash.filter(data.Quotes.elements, (emp) => emp["Feasibility Checked By (If Developer)"].toLowerCase() === name)
                    }
                }
            })
        });
        return object;

    }

    // filteredEmployeeEmplist = () => {
        
    // }

    
    renderTable = (sortedState) => {
        console.log(this.state.filteredEmployee)
        empList = this.state.filteredEmployee.map((person, index) => {
            console.log(person)
            const objectEmp = {};
            const particularEmployeeSheetData = this.getParticularEmployee(person["Employee"].toLowerCase(), this.state.sheetData, []);
            console.log(person["Employee"])
            let objCuttoff = { particularCutoff: {} }
            // 
            let object = { particularFeasiblepoint: [], particularDeights: [], particularQuotes: [] }
            object = this.getOtherData(person["Employee"].toLowerCase(), this.state.sheetData, object);
                     this.getParticularCutoff(person["Employee"].toLowerCase(), this.state.sheetData, objCuttoff);
                     console.log(objCuttoff)
            const data = this.getEmployeesCutOfAndAllotedPoints(particularEmployeeSheetData, person["Employee"].toLowerCase(), objCuttoff.particularCutoff.Cutoff, object);
            objectEmp['sr'] = index + 1;
            objectEmp['Employee'] = person["Employee"];
            objectEmp['cutOff'] = objCuttoff.particularCutoff && objCuttoff.particularCutoff.Cutoff;
            objectEmp['allotedPoint'] = Math.round(data.allotedPoint);
            objectEmp['payablePoint'] = object.particularFeasiblepoint.length > 0
                ?
                Math.round(data.payablePointDev)
                :
                object.particularDeights.length > 0 && object.particularQuotes.length > 0
                ?
                Math.round(data.payblePontPc) : 0
            return objectEmp;
        });

        var checkList = this.state.tempSort ? empList : sortedEmpList;
        // console.log(checkList, this.state.tempSort);
        
        return (
            <>
                {
                    checkList.map((person, index) => {
                        return (
                            <tbody key={index}>
                                <tr>
                                    <th scope="row"><span>{person.sr}</span> </th>
                                    <td><a><span className="employee_name" onClick={this.handleEmplist} >{person["Employe"]}</span></a></td>
                                    <td>{person.cutOff}</td>
                                    <td>{person.allotedPoint}</td>
                                    <td>{person.payablePoint}
                                    </td>
                                </tr>
                            </tbody>
                        )
                    }
                    )
                }
            </>
        )
    }


    asdSort_Cutoff = () => {
        this.setState({ tempSort: false });
        if (!this.state.sorted) {
            sortedEmpList = empList.sort((a, b) => parseFloat(a.cutOff) - parseFloat(b.cutOff));
            this.setState({ asc: true, sorted: true });
            this.renderTable(this.state.renderTable);
            return false;
        } else if (this.state.sorted) {
            this.setState({ sorted: false, asc: false });
            sortedEmpList = sortedEmpList.sort((a, b) => (parseFloat(a.cutOff) > parseFloat(b.cutOff) ? -1 : 1));
            this.renderTable(this.state.renderTable);
            return false;
        }
    };

    asdSort_Alloted = () => {
        this.setState({ tempSort: false });
        if (!this.state.sorted) {
            sortedEmpList = empList.sort((a, b) => parseFloat(a.allotedPoint) - parseFloat(b.allotedPoint));
            this.setState({ asc: true, sorted: true });
            this.renderTable(this.state.renderTable);
            return false;
        } else if (this.state.sorted) {
            this.setState({ sorted: false, asc: false });
            sortedEmpList = sortedEmpList.sort((a, b) => (parseFloat(a.allotedPoint) > parseFloat(b.allotedPoint) ? -1 : 1));

            this.renderTable(this.state.renderTable);
            return false;
        }
    };

    asdSort_Payable = () => {
        this.setState({ tempSort: false });
        if (!this.state.sorted) {
            sortedEmpList = empList.sort((a, b) => parseFloat(a.payablePoint) - parseFloat(b.payablePoint));
            this.setState({ asc: true, sorted: true });
            this.renderTable(this.state.renderTable);
            return false;
        } else if (this.state.sorted) {
            this.setState({ sorted: false, asc: false });
            sortedEmpList = sortedEmpList.sort((a, b) => (parseFloat(a.payablePoint) > parseFloat(b.payablePoint) ? -1 : 1));

            this.renderTable(this.state.renderTable);
            return false;
        }
    };
    //new
    // https://docs.google.com/spreadsheets/d/1beQPRff7mhiEJwBQ2OSRd5S_oyuqdxc0p6sK25G7Phk/
    // https://docs.google.com/spreadsheets/d/1beQPRff7mhiEJwBQ2OSRd5S_oyuqdxc0p6sK25G7Phk/edit#gid=0
    //old
    // https://docs.google.com/spreadsheets/d/1LiWlQHawZaLkaN7S_YMTlvg-CEQfBQ-EaO4nVDHda3Y/edit#gid=0
    getApiCall = (name) => {
        window.googleDocCallback = function () { return true; };
        Tabletop.init({
            key: 'https://docs.google.com/spreadsheets/d/1beQPRff7mhiEJwBQ2OSRd5S_oyuqdxc0p6sK25G7Phk/edit#gid=0',
            callback: data => {

                // console.log(data.database.elements);

                if (localStorage.getItem('authData')) {
                    
                    //fetching all the employee list from database- now have to fetch it from employees
                   
                    const employeeName = data.Employees.elements;
                    const particularEmployee = [];
                    const particularCutoff = [];
                    
                    // admin is now super admin from employee

                    // console.log(employeeName)

                    data.Employees.elements.forEach((obj) => {
                        if (obj['Super Admin'] && obj['Super Admin'] !== '' && obj['Super Admin'].toLowerCase() === name) {
                            this.setState({ isAdmin: true })
                        }
                    })

                    console.log(this.state.isAdmin)

                    this.setState({
                        emp_data: this.getParticularEmployee(name, data, particularEmployee)
                    });

                    this.setState({
                        employees: employeeName, filteredEmployee: employeeName, sheetData: data
                    })

                    console.log(this.state.filteredEmployee)
                    const objCuttoff = { particularCutoff: [] }

                    this.getParticularCutoff(name, data, objCuttoff)

                    const object = { particularFeasiblepoint: [], particularDeights: [], particularQuotes: [] }


                    this.getOtherData(name, data, object)


                    if (particularEmployee.length === 0) {
                        this.setState({
                            error_msg: 'No data found with this name!'
                        })
                    }

                    this.setState({
                        Cutoff: objCuttoff.particularCutoff.Cutoff,
                        feasibilityPoint: object.particularFeasiblepoint,
                        delights: object.particularDeights,
                        quotes: object.particularQuotes
                    })
                    
                }
            }
        });

    }


    componentDidMount() {
        this.getApiCall((this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()));
    }

    componentDidUpdate = (props, state) => {
        if (this.state.search !== state.search) {
            this.getApiCall((this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()));
        }
    }

    handleFilter = (e) => {
        var employeeList = this.state.employees,
            searchEmp = e.target.value.trim().toLowerCase();
            
        if (searchEmp.length > 0) {
            if(this.state.tempSort){
                employeeList = employeeList.filter((person => person["Employee"].toLowerCase().indexOf(searchEmp) > -1)) 
            }
            else{
               employeeList = sortedEmpList.filter((person => person["Employee"].toLowerCase().indexOf(searchEmp) > -1))
            }
            
            this.setState({
                filteredEmployee: employeeList
            } , () => {
                console.log(this.state.filteredEmployee);
            });
        } else {
            
            this.setState({
                filteredEmployee: this.state.employees
            });
        }
    }

    handleEmplist = (e) => {
        this.setState({
            search: e.target.textContent,
            isEmpSelected: true,
            emp_data: []
        });
    }

    render() {
        return (
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                        {!this.state.isEmpSelected && this.state.isAdmin && <li className="float-right"><span>Search Employee</span><input type="text" onKeyUp={this.handleFilter} placeholder="type here..."/></li>}
                        {this.state.isEmpSelected &&
                            <li className="float-right back_btn" onClick={this.handleBackbtn}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z" /></svg> Back
                            </li>}
                    </ol>
                </nav>
                {!this.state.isAdmin && (
                    <>
                        {
                            !!this.state.emp_data.length ?
                                (
                                    <React.Fragment>
                                        <ul className="nav nav-tabs">
                                            <li className="nav-item" onClick={() => this.handleChangeTab(0)}>
                                                <p className={`nav-link ${this.state.selectedTab === 0 ? 'active' : ''}`} href="#!">Points</p>
                                            </li>
                                            <li className="nav-item" onClick={() => this.handleChangeTab(1)}>
                                                <p className={`nav-link ${this.state.selectedTab === 1 ? 'active' : ''}`} href="#!">Projects</p>
                                            </li>
                                            <li className="nav-item" onClick={() => this.handleChangeTab(2)}>
                                                {
                                                    this.state.feasibilityPoint.length !== 0 ? (<p className={`nav-link ${this.state.selectedTab === 2 ? 'active' : ''}`} href="#!">Feasibility</p>) :
                                                        (<p className={`nav-link ${this.state.selectedTab === 2 ? 'active' : ''}`} href="#!">Delights</p>)}
                                            </li>
                                            {this.state.delights.length !== 0 ? (
                                                <li className="nav-item" onClick={() => this.handleChangeTab(3)}>
                                                    <p className={`nav-link ${this.state.selectedTab === 3 ? 'active' : ''}`} href="#!">Quotes</p>
                                                </li>
                                            ) : null}
                                        </ul>
                                        {
                                            this.state.selectedTab === 0 ? this.getPointTable(this.state.emp_data) :
                                                this.state.selectedTab === 1 ? this.getProjectTable() :
                                                    this.state.selectedTab === 3 ? this.getQuotesPoint() :
                                                        this.state.selectedTab === 2 && this.state.feasibilityPoint.length ? this.getFeasibilitytable() : this.getDelightPoint()
                                        }
                                    </React.Fragment>
                                ) : this.state.error_msg.length !== 0 ? (<h1>{this.state.error_msg}</h1>) : 
                                    (
                                    <div className="text-center">
                                        <img src={loader} alt="loader"/>
                                    </div>  
                                    )
                        }
                    </>
                )}
                {
                    this.state.isAdmin && (
                        <table className="table table-hover">
                            {!this.state.isEmpSelected ?
                                (
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Employee Name</th>
                                            <th onClick={this.asdSort_Cutoff}>Cutoff<svg width="30" height="30" className="octicon octicon-chevron-down" viewBox="0 0 10 16" version="1.1" aria-hidden="true"><path fillRule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path></svg></th>
                                            <th onClick={this.asdSort_Alloted}>Allotted Point<svg width="30" height="30" className="octicon octicon-chevron-down" viewBox="0 0 10 16" version="1.1" aria-hidden="true"><path fillRule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path></svg></th>
                                            <th onClick={this.asdSort_Payable}>Payable Point<svg width="30" height="30" className="octicon octicon-chevron-down" viewBox="0 0 10 16" version="1.1" aria-hidden="true"><path fillRule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path></svg></th>
                                        </tr>
                                    </thead>
                                ) : null}
                            {
                                !this.state.isEmpSelected && this.renderTable()
                            }
                            {
                                this.state.isEmpSelected && !!this.state.emp_data.length ?
                                    (
                                        <React.Fragment>
                                            <ul className="nav nav-tabs">
                                                <li className="nav-item" onClick={() => this.handleChangeTab(0)}>
                                                    <p className={`nav-link ${this.state.selectedTab === 0 ? 'active' : ''}`} href="#!">Points</p>
                                                </li>
                                                <li className="nav-item" onClick={() => this.handleChangeTab(1)}>
                                                    <p className={`nav-link ${this.state.selectedTab === 1 ? 'active' : ''}`} href="#!">Projects</p>
                                                </li>
                                                <li className="nav-item" onClick={() => this.handleChangeTab(2)}>
                                                    {this.state.feasibilityPoint.length !== 0 ? (<p className={`nav-link ${this.state.selectedTab === 2 ? 'active' : ''}`} href="#!">Feasibility</p>) :
                                                        (<p className={`nav-link ${this.state.selectedTab === 2 ? 'active' : ''}`} href="#!">Delights</p>)}
                                                </li>
                                                {this.state.delights.length !== 0 ? (
                                                    <li className="nav-item" onClick={() => this.handleChangeTab(3)}>
                                                        <p className={`nav-link ${this.state.selectedTab === 3 ? 'active' : ''}`} href="#!">Quotes</p>
                                                    </li>
                                                ) : null}
                                            </ul>
                                            {
                                                this.state.selectedTab === 0 ? this.getPointTable(this.state.emp_data) :
                                                    this.state.selectedTab === 1 ? this.getProjectTable() :
                                                        this.state.selectedTab === 3 ? this.getQuotesPoint() :
                                                            this.state.selectedTab === 2 && this.state.feasibilityPoint.length ? this.getFeasibilitytable() : this.getDelightPoint()
                                            }
                                        </React.Fragment>
                                    ) : this.state.error_msg.length !== 0  ? (<h1>{this.state.error_msg}</h1>)
                                        : this.state.isEmpSelected ?
                                        (
                                            <div className="text-center">
                                                <img src={loader} alt="loader"/>
                                            </div>  
                                        ): null
                            }
                        </table>
                    )
                }
            </div>
        )
    }

    handleChangeTab = (index) => {
        this.setState({
            selectedTab: index
        });
    }

    handleBackbtn = () => {
        this.setState({
            emp_data: [], Cutoff: '', selectedTab: 0, feasibilityPoint: [],
            delights: [], quotes: [], search: '', isEmpSelected: false, filteredEmployee: this.state.employees, search: '', error_msg: ''
        })

    }

    getEmployeesCutOfAndAllotedPoints = (emp_data, name, Cutoff, object) => {

        const allocated = [];
        const kickoff = [];
        const retention = [];
        const timelydelivery = [];
        const postdeliverypoint = [];
        const eligiblepoint = [];
        const finalpoint = [];
        const finalsum = []
        var cutoffPoint = [];
        var escaltions = 0;

        if (emp_data.length > 0) {

            emp_data.map((person, index) => {
                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === name)) {
                        return allocated.push(person[`${str} Points`])
                    }
                })

                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === name)) {
                        return kickoff.push(person[`${str} Kickoff`])
                    }
                })

                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === name)) {
                        return retention.push(person[`${str} Retention`])
                    }
                })

                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === name)) {
                        return timelydelivery.push(person[`${str} TImely Delivery`])
                    }
                })

                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === name)) {
                        return postdeliverypoint.push(person[`${str} PDC Points`])
                    }
                })

                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === name)) {
                        return eligiblepoint.push(person[`${str} Eligible`])
                    }
                })

                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === name)) {
                        return finalpoint.push(person[`${str} Final`])
                    }
                })

                if (person['Client Feedback'] === 'Escalation') {
                    escaltions = escaltions + 1
                };

            });
        }

        cutoffPoint = Cutoff;

        const feasibilitypoint = [];
        if (object.particularFeasiblepoint && object.particularFeasiblepoint.length > 0) {
            object.particularFeasiblepoint.map((person, index) => {
                feasibilitypoint.push(person["Feasibility Points"])
            })
        }

        const quotesPoint = [];
        if (object.particularQuotes && object.particularQuotes.length > 0) {
            object.particularQuotes.map((person, index) => {
                quotesPoint.push(person["Quote Points"])
            })
        }

        const testimonyPoint = [];
        if (object.particularDeights && object.particularDeights.length > 0) {
            object.particularDeights.map((person, index) => {
                testimonyPoint.push(person["Testimony Points"]);
            })
        }


        finalpoint.forEach(function (el, i) {
            finalsum.push(el.split(',').join(''))
        })

        const totalFinalpoint = this.sum(finalsum);

        const totalAlloted = this.sum(allocated);

        var totalBooster = 0;

        var totalFeasibilitypoint = this.sum(feasibilitypoint);
        var totalQuotespoint = this.sum(quotesPoint);
        var totalTestymonypoint = this.sum(testimonyPoint);

        if (totalAlloted > (cutoffPoint * 5)) {
            totalBooster = totalAlloted * (20 / 100);
        } else {
            totalBooster = 0
        }

        var totalEdpfordev = (totalFinalpoint + totalFeasibilitypoint + totalBooster) * escaltions * (5 / 100);

        var totalEdpforpc = (totalFinalpoint + totalQuotespoint + totalTestymonypoint + totalBooster) * escaltions * (5 / 100);

        var payablePointDev = Math.round((totalFinalpoint + totalFeasibilitypoint + totalBooster) - (cutoffPoint) - totalEdpfordev);
        var payablePointPc = Math.round((totalFinalpoint + totalQuotespoint + totalTestymonypoint + totalBooster) - (cutoffPoint) - totalEdpforpc)

        return { cutoffPoint: cutoffPoint, allotedPoint: totalAlloted, payablePointDev: payablePointDev, payblePontPc: payablePointPc }

    }


    getProjectTable = () => {
        console.log(this.state.emp_data);
        
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
                                    <td>{index + 1}</td>
                                    <td>{person['Project Name']}</td>
                                    <td>{person['Project Type']}</td>
                                    <td>{person['Project Status']}</td>
                                    <td>{person['Client Feedback']}</td>
                                    <td>{person['Point Type']}</td>
                                    <td>{
                                        (
                                            devKeys.map((str) => {
                                                if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
                                                    if(person['Point Type'] !== "CF Feedback"){
                                                        return person[`${str} Points`];                                              
                                                    }else{
                                                        return 0;   
                                                    }
                                                }
                                            })
                                        )                                        
                                    }</td>
                                    <td>{
                                        devKeys.map((str) => {
                                            // console.log(str);    
                                            if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
                                               
                                                return person[`${str} Kickoff`];
                                            }
                                        })
                                    }</td>
                                    <td>{
                                        devKeys.map((str) => {
                                            if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
                                                return person[`${str} Retention`];
                                            }
                                        })
                                    }</td>
                                    <td>{
                                        devKeys.map((str) => {
                                            if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
                                                return person[`${str} TImely Delivery`];
                                            }
                                        })
                                    }</td>
                                    <td>{
                                        devKeys.map((str) => {
                                            if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
                                                return person[`${str} PDC Points`];
                                            }
                                        })
                                    }</td>
                                    <td>{
                                        devKeys.map((str) => {
                                            if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
                                                return person[`${str} Eligible`];
                                            }
                                        })
                                    }</td>
                                    <td>{
                                        devKeys.map((str) => {
                                            if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
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
                            <div className="text-center">
                                    <img src={loader} alt="loader"/>
                                </div>  
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        )
    }

    sum = (input) => {

        if (toString.call(input) !== "[object Array]")
            return false;

        var total = 0;
        for (var i = 0; i < input.length; i++) {
            if (isNaN(input[i])) {
                continue;
            }
            total += Number(input[i]);
        }
        return total;
    }

    getPointTable = (emp_data) => {

        const allocated = [];
        const kickoff = [];
        const retention = [];
        const timelydelivery = [];
        const postdeliverypoint = [];
        const eligiblepoint = [];
        const finalpoint = [];
        const finalsum = []
        var cutoffPoint = '';
        var escaltions = 0
        if (this.state.emp_data.length > 0) {
            this.state.emp_data.map((person, index) => {
                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
                        return allocated.push(person[`${str} Points`])
                    }
                })

                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
                        return kickoff.push(person[`${str} Kickoff`])
                    }
                })

                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
                        return retention.push(person[`${str} Retention`])
                    }
                })

                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
                        return timelydelivery.push(person[`${str} TImely Delivery`])
                    }
                })

                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
                        return postdeliverypoint.push(person[`${str} PDC Points`])
                    }
                })

                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
                        return eligiblepoint.push(person[`${str} Eligible`])
                    }
                })

                devKeys.map((str) => {
                    if (person[`${str} Name`] !== '' && (person[`${str} Name`].toLowerCase() === (this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase()))) {
                        return finalpoint.push(person[`${str} Final`])
                    }
                })


                if (person['Client Feedback'] === 'Escalation') {
                    escaltions = escaltions + 1
                };
            });
        }

        if (this.state.Cutoff === undefined) {
            cutoffPoint = 'Not found';
        } else {
            cutoffPoint = this.state.Cutoff;
        }

        const feasibilitypoint = [];
        if (this.state.feasibilityPoint && this.state.feasibilityPoint.length > 0) {
            this.state.feasibilityPoint.map((person, index) => {
                feasibilitypoint.push(person["Feasibility Points"])
            })
        }

        const quotesPoint = [];
        if (this.state.quotes && this.state.quotes.length > 0) {
            this.state.quotes.map((person, index) => {
                quotesPoint.push(person["Quote Points"])
            })
        }

        const testimonyPoint = [];
        if (this.state.delights && this.state.delights.length > 0) {
            this.state.delights.map((person, index) => {
                testimonyPoint.push(person["Testimony Points"]);
            })
        }


        finalpoint.forEach(function (el, i) {
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

        var totalFeasibilitypoint = this.sum(feasibilitypoint);
        var totalQuotespoint = this.sum(quotesPoint);
        var totalTestymonypoint = this.sum(testimonyPoint);

        if (totalAlloted > (cutoffPoint * 5)) {
            totalBooster = totalAlloted * (20 / 100);
        } else {
            totalBooster = 0
        }

        var totalEdpfordev = (totalFinalpoint + totalFeasibilitypoint + totalBooster) * escaltions * (5 / 100);

        var totalEdpforpc = (totalFinalpoint + totalQuotespoint + totalTestymonypoint + totalBooster) * escaltions * (5 / 100);


        return (
            <div>
                {
                    !!this.state.emp_data.length ? (
                        <table className="user dash">
                            <tbody>
                                <tr className="highlight">
                                    <th>Name</th>
                                    <td className="text-capitalize">{(this.state.search === '' ? JSON.parse(localStorage.getItem('authData')).name.toLowerCase() : this.state.search.toLowerCase())}</td>
                                </tr>
                                <tr>
                                    <th>Your Quarterly Cut-off</th>
                                    <td>{this.state.Cutoff === undefined ? 'Not found' : cutoffPoint}</td>
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

                                {this.state.delights.length !== 0 ?
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
                                    {this.state.feasibilityPoint.length !== 0 ?
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
                                    <td>{this.state.Cutoff === undefined ? 'Not found' : cutoffPoint}</td>
                                </tr>
                                <tr>
                                    <th className="makered">Number of Escalations</th>
                                    <td className="makered">{escaltions}</td>
                                </tr>
                                {this.state.delights.length !== 0 ? (
                                    <tr>
                                        <th className="makered">Escalation Deduction Points</th>
                                        <td className="makered">{Math.round(totalEdpforpc)}</td>
                                    </tr>
                                ) : (
                                        <tr>
                                            <th className="makered">Escalation Deduction Points</th>
                                            <td className="makered">{Math.round(totalEdpfordev)}</td>
                                        </tr>
                                    )}

                                <tr>
                                    <th>Efficiency Booster</th>
                                    <td>{Math.round(totalBooster)}</td>
                                </tr>

                                <tr className="highlight">
                                    <th>Payable Points</th>
                                    {
                                        this.state.delights.length !== 0
                                            ?
                                            (<td>{Math.round((totalFinalpoint + totalQuotespoint + totalTestymonypoint + totalBooster) - (cutoffPoint) - totalEdpforpc)}</td>)
                                            :
                                            (<td>{Math.round((totalFinalpoint + totalFeasibilitypoint + totalBooster) - (cutoffPoint) - totalEdpfordev)}</td>)
                                    }
                                </tr>


                            </tbody>
                        </table>
                    ) :
                        (<div className="text-center">
                            <img src={loader} alt="loader"/>
                        </div>  )
                }
            </div>
        )
    }

    getFeasibilitytable = () => {
        return (
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
                                    <td>{index + 1}</td>
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
                                <div className="text-center">
                                        <img src={loader} alt="loader"/>
                                </div>  
                            </td>
                        </tr>
                    }

                </tbody>
            </table>
        )
    }

    getDelightPoint = () => {


        return (
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
                                    <td>{index + 1}</td>
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
                                <div className="text-center">
                                        <img src={loader} alt="loader"/>
                                </div>  
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        )
    }

    getQuotesPoint = () => {
        return (
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
                                    <td>{index + 1}</td>
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
                                <div className="text-center">
                                    <img src={loader} alt="loader"/>
                                </div>                                
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        )
    }
}