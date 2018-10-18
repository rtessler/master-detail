import React from 'react';

import './centres.scss';

export default class Centres extends React.Component {

    constructor(props) {

        super(props);       

        this.state = {activeId: 0}
    }

    onChange(fieldname, id, e) {

        let val;
        
        switch (e.target.type) {
            case 'checkbox': val = e.target.checked; break;
            default: val = e.target.value; break
        }

        const { data } = this.props

        const o = data.find(x => ( x.id == id ));

        if (o) {

            o[fieldname] = val;

            if (this.props.onChange)
                this.props.onChange(o);
        }
    }   

    onAdd() {
       
        if (this.props.onAdd)
            this.props.onAdd();        
    }

    onDelete(id) {

        const { data } = this.props

        const o = data.find(x => ( x.id == id ));
        
        if (o && this.props.onDelete) {
            this.props.onDelete(o);  
        }
    }     
    
    onClick(id) {

        const { data } = this.props

        const o = data.find(x => ( x.id == id ));

        this.setState({activeId: id});

        if (this.props.onClick)
            this.props.onClick(o)
    }

    render() {

        const { data } = this.props

        let { activeId } = this.state;

        if (!activeId && data && data.length > 0)
            activeId = data[0].id


        return (

            <div className='centres'>

                <div className='buttons'>
                    <h3>Centres</h3>

                    <button className='btn' onClick={this.onAdd.bind(this)}>add</button>
                </div>
                            

                <table className='col-8'>
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>address</th>
                            <th></th>
                        </tr>
                    </thead>
                
                    <tbody>

                        {
                            data ?

                                data.map((o, i) => {

                                    let className = 'centre '

                                    if (activeId === o.id)
                                        className += " active"

                                    return (<tr className={className} key={i} onClick={this.onClick.bind(this, o.id)}>

                                        <td>
                                            <input onChange={this.onChange.bind(this, 'name', o.id)} value={o.name} />  
                                        </td>

                                        <td>
                                            <input onChange={this.onChange.bind(this, 'address', o.id)} value={o.address} />
                                        </td> 

                                        <td>
                                            <button className='btn' onClick={this.onDelete.bind(this, o.id)}>delete</button>
                                        </td>                                                                      

                                    </tr>)
                                }                                  
                                )
                            :
                            null
                        }

                    </tbody>
                </table>     

             </div> 
        )  

    }
}