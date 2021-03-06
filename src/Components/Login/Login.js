import React, { Component } from 'react'
import {GoogleLogin} from 'react-google-login';
import { withRouter} from 'react-router-dom';
import logo from '../../img/download.png'

 class Login extends Component {

    state = {
        Authenticate: false,
        name: ''
    }

    componentDidMount = ()=>{
        if(localStorage.getItem('authData')){
            this.setState({Authenticate: true, name: JSON.parse(localStorage.getItem('authData')).name})   
        }
    }

    responseGoogle = (response) => {

        var email = response.profileObj.email;
        var validEmail = email.split('@');
        if(validEmail[1] !== "uplers.in"){
            this.setState({
                Authenticate:false
            })
            response.isSignedIn = false;          
        }else{
            response.isSignedIn = true;
        }
        if(response.isSignedIn){
            localStorage.setItem('authData', JSON.stringify({token: response.tokenId, name: response.profileObj.name}));
            this.setState({ Authenticate: true, name: response.profileObj.name })
            this.props.history.push('dashboard');
        }
    }

    render() {
        return (
            <div>
                {!this.state.Authenticate
                ? (<div className="loginbtn">
                    <h2><img className='logoimg' src={logo} alt='logo'/> Uplers</h2>
                    <GoogleLogin
                    {...this.props}
                    clientId="112044915268-oos0v8drjffvg3hqgnko5vg6ourqr6nt.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                />
                <p>Please login with your uplers account!</p>
                </div>
                ): null}

            </div>          
        )
    }
}


export default  withRouter(Login)