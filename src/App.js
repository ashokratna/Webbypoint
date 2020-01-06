import React from 'react';
import './App.css';
import Login from './Components/Login'
import {
  Switch,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";
import Layout from './Components/Layout';
import Dashboard from './Components/Dashboard';
import Admin from './Components/Admin';

class App extends React.Component {
  render() {
    if(localStorage.getItem('authData')){
      return(
        <Layout>
          <Switch>
            <Route path='/dashboard' component={Dashboard} exact/>
            <Route path='/admin' component={Admin} />
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
