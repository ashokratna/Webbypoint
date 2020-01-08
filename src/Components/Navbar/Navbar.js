import React ,{Component} from 'react';
import '../../Style/Common.css';
import {withRouter} from 'react-router-dom'


class Navbar extends Component{
  
    render(){
    return (
        <div>
                <nav className="navbar navbar-inverse navbar-global navbar-fixed-top">
                <div className="container-fluid">
                <div className="navbar-header">
                
                    <a className="navbar-brand" href=""><svg id="i-user" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path d="M22 11 C22 16 19 20 16 20 13 20 10 16 10 11 10 6 12 3 16 3 20 3 22 6 22 11 Z M4 30 L28 30 C28 21 22 20 16 20 10 20 4 21 4 30 Z" />
                </svg>Hello, {JSON.parse(localStorage.getItem('authData')).name}</a>
                </div>
                        <ul className="nav navbar-nav navbar-user navbar-right">
                           <li onClick={(e) => {
                               console.log(this)
                               localStorage.clear(); 
                               sessionStorage.clear();
                               this.props.history.push('/login')
                           }}><span className="glyphicon glyphicon-log-out"></span><svg id="i-signout" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                           <path d="M28 16 L8 16 M20 8 L28 16 20 24 M11 28 L3 28 3 4 11 4" />
                       </svg> Logout</li>
                        </ul>
                </div>
                </nav>

                {/* <nav className="navbar-primary" ref="navbar">
                    <a href="#" className="btn-expand-collapse"><span className="glyphicon glyphicon-menu-left"></span></a>
                    <ul className="navbar-primary-menu">
                    <li>
                        <NavLink 
                            to='dashboard'  
                            activeStyle={{
                            fontWeight: "bold",
                            backgroundColor:" #111",
                        }}>
                            <span className="glyphicon glyphicon-list-alt"></span><span className="nav-label">Dashboard</span>                            
                        </NavLink>
                        <NavLink 
                        to='admin'
                        activeStyle={{
                            fontWeight: "bold",
                            backgroundColor:" #111"
                        }}>
                            <span className="glyphicon glyphicon-list-alt"></span><span className="nav-label">Admin</span>                            
                        </NavLink>
                      
                    </li>
                    </ul>
                </nav> */}
  </div>
    );
}
}
export default withRouter(Navbar);