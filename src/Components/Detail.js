import React, { Component } from 'react'
import Tabletop from "tabletop";
import * as lodash from 'lodash';
import '../Style/Common.css'

export default class Detail extends Component {
    state = {
        emp_detail: []
    }

    componentDidMount(){
            Tabletop.init({ key: 'https://docs.google.com/spreadsheets/d/1LiWlQHawZaLkaN7S_YMTlvg-CEQfBQ-EaO4nVDHda3Y/edit#gid=0',
                              callback: data=>{
                                  if(localStorage.getItem('authData')) {
                                      const  particularEmployee = lodash.filter(data.Projects.elements, emp => emp['Dev1 Name'].toLowerCase() === JSON.parse(localStorage.getItem('authData')).name.toLowerCase());
                                      console.log(particularEmployee)
                                      this.setState({
                                          emp_detail : particularEmployee
                                      })
                                  }
                              },
                              simpleSheet: false } )
                        }

    render() {
        console.log(this.state.emp_detail)
        return (
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active" aria-current="page">Detail</li>
                    </ol>
                </nav>
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
                    !!this.state.emp_detail.length && this.state.emp_detail.map((person, index) => {
                        return (
                            <tr key={index}>
                                <td>{person['Project Name']}</td>
                                <td>{person['Project Type']}</td>
                                <td>{person['Project Status']}</td>
                                <td>{person['Client Feedback']}</td>
                                <td>{person['Point Type']}</td>
                                <td>{person['Dev1 Points']}</td>
                                <td>{person['Dev1 Kickoff']}</td>
                                <td>{person['Dev1 Retention']}</td>
                                <td>{person['Dev1 TImely Delivery']}</td>
                                <td>{person['Dev1 PDC Points']}</td>
                                <td>{person['Dev1 Eligible']}</td>
                                <td>{person['Dev1 Final']}</td>
                            </tr>
                        )
                    }) 
                }
                {
                    !this.state.emp_detail.length &&
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

            </div>
        )
    }
}