import React from 'react';
import DataService from '../dataService/dataService'

import CookieTools from '../cookie/cookie'

import './login.scss';

export default class Login extends React.Component {

    constructor(props) {

        super(props);     
        
        this.state = {username: "admin", password: "password", errorMessage: ""}
    }

    onLogin() {

        const dataService = new DataService()

        const data  = this.state

        dataService.login(data.username, data.password)
        .then (response => response.json()) // parses response to JSON   
        .then(res => {


            if (res.status) {

                // store token in session storage
                
                //sessionStorage.setItem("token", res.token);

                CookieTools.setCookie('token', res.token, res.expiresIn);

                this.onClose();
            }
            else {
                this.setState({errorMessage: res.message});
            }

        });  
    }

    onClose(res) {

        if (this.props.onClose)
            this.props.onClose(res)
    }

    onChange(name, e) {

        let val = e.target.value

        switch (name) {
            case "username": this.setState({username: val}); break;
            case "password": this.setState({password: val}); break;
        }
    }

    render() {

        const data = this.state;

        return (

            <div className='login'>

                <div className='cross' onClick={this.onClose.bind(this)}></div>
                
                <div className='field'>
                    <span>Username</span>
                    <input className='username' autoComplete="off" onChange={this.onChange.bind(this, "username")} value={data.username} />
                </div>

                <div className='field'>
                    <span>Password</span>
                    <input className='password' autoComplete="off" type='password' onChange={this.onChange.bind(this, "password")} value={data.password} />
                </div>  

                <div className='errorMessage'>{data.errorMessage}</div>

                <button name="button" className="btn btn-primary active" onClick={this.onLogin.bind(this)}>Login</button>              
            
            </div>   
        );
    }
}