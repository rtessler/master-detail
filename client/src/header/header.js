import React from 'react';
import Modal from '../modal/modal'
import Login from '../login/login'
import CookieTools from '../cookie/cookie'

import './header.scss';

export default class Header extends React.Component {

    constructor(props) {

        super(props);       

        this.state = {showModal: false};
    }

    onShowModal() {

        this.setState({showModal: true})
    }

    onCloseModal() {

        this.setState({ showModal: false });
    }    

    render() {

        const token = CookieTools.getCookie("token")

        return (
            <nav className="header navbar navbar-dark bg-dark">

                {
                    this.state.showModal ?

                        <Modal onClose={this.onCloseModal.bind(this)}  >
                            <Login onClose={this.onCloseModal.bind(this)} />                       
                        </Modal>     
                    :
                        null                   
                }               

                <div className="container-fluid">

                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">Shopping Centre Asset Manager</a>                        
                    </div>

                    <div className="logged-in">
                        { token ? 'logged in' : 'not logged in '}
                    </div>

                    <a onClick={this.onShowModal.bind(this)}>
                        <span className="glyphicon glyphicon-log-in"></span> login
                    </a>
                
                </div>

            </nav>
        );

    }
}