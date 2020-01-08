import React from 'react';
import './App.css';
import Login from './Components/Login/Login'
import {
  Switch,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";
import Layout from './Components/Layout/Layout';
import Dashboard from './Components/Dashboard/Dashboard';

class App extends React.Component {
  render() {
    if(localStorage.getItem('authData')){
      return(
        <Layout>
          <Switch>
            <Route path='/dashboard' component={Dashboard} exact/>
            <Redirect to='dashboard'/>
          </Switch>
      </Layout>
      )
    } else{
      return(
        <Switch>
          <Route path='/login' component={Login} exact />
          <Redirect to='login'/>
        </Switch>
      )
    }

  }
}

export default withRouter(App);
