import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'

class Logout extends Component {
      
    logout = (e) => {
        localStorage.clear(); 
        sessionStorage.clear();
        this.props.history.push('/login')
    } 


    render() {
        return (
            <div>
               <a onClick={this.logout}>Logout</a>
            </div>
        )
    }
}


export default withRouter(Logout)