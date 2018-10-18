import React from 'react';

import './assets.scss';

export default class Assets extends React.Component {

    constructor(props) {

        super(props);    
    }

    onChange(fieldname, id, e) {        
        
        let val;

        switch (e.target.type) {
            case 'checkbox': val = e.target.checked; break;
            default: val = e.target.value; break
        }

        const { data } = this.props

        let o = data.find(x => (x.id == id) ) ;

        if (o) {
            o[fieldname] = val;

            if (this.props.onChange)
                this.props.onChange(o);
        }
    }    

    onAdd() {

        console.log('on add')
       
        if (this.props.onAdd)
            this.props.onAdd();        
    }

    onDelete(id) {

        const { data } = this.props     

        let o = data.find(x => ( x.id == id ));
        
        if (o && this.props.onDelete) {
            this.props.onDelete(o);        
        }
    }   

    onFilter(e) {

        let val = e.target.value

        if (this.props.onFIlter)
            this.props.onFilter(val)
    } 

    render() {

        const { data, centreId } = this.props 

        return (

            <div className='assets'>

                <div className='buttons'>

                    <h3>Assets</h3>

                    {
                        centreId ?
                            <button className='btn' onClick={this.onAdd.bind(this)}>add</button>
                            :
                            null
                    }
                    

                </div>
                           
                <table className='col-8'>
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>dimensions</th>
                            <th>location</th>
                            <th>status</th>                            
                            <th></th>
                        </tr>
                    </thead>
                
                    <tbody>

                        {
                            data.map((o, i) => 

                                <tr className="centre" key={i}>

                                    <td>
                                        <input onChange={this.onChange.bind(this, 'name', o.id)} value={o.name} />  
                                    </td>

                                    <td>
                                        <input onChange={this.onChange.bind(this, 'dimensions', o.id)} value={o.dimensions} />
                                    </td> 

                                    <td>
                                        <input onChange={this.onChange.bind(this, 'location', o.id)} value={o.location} />
                                    </td> 

                                    <td className='status'>
                                        <input type='checkbox' onChange={this.onChange.bind(this, 'status', o.id)} checked={o.status} />
                                    </td>                                   

                                    <td>
                                        <button className='btn' onClick={this.onDelete.bind(this, o.id)}>delete</button>
                                    </td>                                                                      

                                </tr>                                    
                            )
                        }

                    </tbody>
                </table>     

             </div> 
        )  

    }
}