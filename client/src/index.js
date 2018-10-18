import React from 'react';
import ReactDOM from 'react-dom';

import Header from './header/header';
import AssetManager from './assetManager/assetManager';

import 'bootstrap/dist/css/bootstrap.min.css';

import './index.scss';

export default class Main extends React.Component {

    constructor(props) {

        super(props);         
    }	

	render() {

		return (
			<div className='main'>
			
				<Header />

				<br />

				<div className='container'>
			
					<AssetManager />

				</div>
				
			</div>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('content'));