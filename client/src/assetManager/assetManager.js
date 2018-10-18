import React from 'react';
import DataService from '../dataService/dataService'
import Centres from '../centres/centres'
import Assets from '../assets/assets'

import './assetManager.scss';


export default class AssetManager extends React.Component {

    constructor(props) {

        super(props);       

        this.dataService = new DataService()

        this.state = {centres: [], assets: [], deletedCentres: [], deletedAssets: [], centreId: 0, loading: false };
    }

    componentDidMount() {

        this.loadData()
    }

    loadData() {

        this.setState({loading: true});

        this.dataService.get("centre")
        .then(data => { 

            this.setState({centres: data.data})
        }).catch(e => {

            this.setState({loading: false})
        })

        // get the assets

        this.dataService.get("asset").then(data => {

            this.setState({assets: data.data, loading: false})
        }).catch(e => {

            this.setState({loading: false})
        })
    }

    onSelectCentre(data) {

        // user clicked on a centre

        this.setState({centreId: data.id})
    }

    //---------------------------------------------    

    onAddCentre() {

        const { centres } = this.state;  

        // get the next id

        let id = 0;

        centres.forEach(o => {

            if (o.id > id)
                id = o.id
        })

        // ids start at 1

        id++;

        let data = {id: id, name: 'new', address: 'new', new: true};

        centres.push(data)

        this.setState({centres: centres})
    }

    onChangeCentre(data) {

        const { centres } = this.state;  

        let x = centres.find(o => { return o.id === data.id })

        if (x) {
          
            x.name = data.name
            x.address = data.address
            x.changed = true

            this.setState({centres: centres})
        }
    }

    onDeleteCentre(data) {

        let { centres, deletedCentres, assets, deletedAssets } = this.state;  

        // remove centre from the array

        centres = centres.filter((item) => { return item.id !== data.id })

        // add to deleted array

        deletedCentres.push(data);


        assets.forEach((item) => { 
            
            if (item.cid === data.id)
                deletedAssets.push(item);
        });

        assets = assets.filter((item) => { return item.cid !== data.id })

        this.setState({centres: centres, deletedCentres: deletedCentres, assets: assets, deletedAssets: deletedAssets})
    }

    //---------------------------------------------

    onAddAsset() {

        const { centres, assets, centreId } = this.state;  

        let cid = (!centreId && centres.length > 0) ? centres[0].id : centreId    
        
        // centre must be set

        if (!cid)
            return        

        // get the next id

        let id = 0;

        assets.forEach(o => {

            if (o.id > id)
                id = o.id
        })

        // ids start at 1

        id++;

        let data = {id: id, cid: cid, name: 'new', dimensions: 'new', location: 'new', status: true, new: true};

        assets.push(data)

        this.setState({assets: assets})
    }

    onChangeAsset(data) {

        const { assets } = this.state;  

        let x = assets.find(o => { return o.id === data.id })

        if (x) {
          
            x.name = data.name
            x.cid = data.cid
            x.dimensions = data.dimensions
            x.location = data.location
            x.status = data.status            
            x.changed = true

            this.setState({assets: assets})
        }
    }

    onDeleteAsset(data) {

        let { assets, deletedAssets } = this.state;  

        // remove centre from the array

        assets = assets.filter(function(item) { return item.id !== data.id })

        // add to deleted array

        deletedAssets.push(data);

        this.setState({assets: assets, deletedAssets: deletedAssets})
    }  
    
    onFilterAssets(val) {

        const { assets } = this.props  

        if (val == null || val == '' || !assets) {

            this.setState({filteredAssets: data});
        }
        else {

            val = val.toLowerCase();

            const filteredAssets = assets.filter(x => (x.name.toLowerCase().indexOf(val) > -1 ))
        
            this.setState({filteredAssets: filteredAssets});
        }
    }     

    //---------------------------------------------

    onSave() {

        const { centres, deletedCentres, assets, deletedAssets } = this.state;  

        let newCentres = centres.filter((item) =>  item.new ) 
        let updatedCentres = centres.filter((item) =>  item.changed )  
        
        let promises = []
            
        if (newCentres && newCentres.length > 0) {

            newCentres.forEach(x => { 
                
                // delete meta properties

                delete x.new;
                delete x.changed;                
            })

            promises.push(this.dataService.add("centre", newCentres) )
        }
                
        if (updatedCentres && updatedCentres.length > 0) {

            updatedCentres.forEach(x => { 
                
                delete x.new;
                delete x.changed;     
                
                promises.push(this.dataService.update("centre", x))
            })            
        }  
        
        if (deletedCentres && deletedCentres.length > 0) {

            deletedCentres.forEach(x => { 
                        
                promises.push(this.dataService.delete("centre", x) )
            })            
        }

        //-------------------------------------------------------------------------------

        let newAssets = assets.filter((item) => { return item.new }) 
        let updatedAssets = assets.filter((item) => { return item.changed })  
        
        if (newAssets && newAssets.length > 0) {

            newAssets.forEach(x => { 

                // delete meta properties
                
                delete x.new;
                delete x.changed;                
            })

            promises.push(this.dataService.add("asset", newAssets ))
        }
                
        if (updatedAssets && updatedAssets.length > 0) {

            updatedAssets.forEach(x => { 
                
                delete x.new;
                delete x.changed;

                promises.push(this.dataService.update("asset", x))
            })            
        }  
        
        if (deletedAssets && deletedAssets.length > 0) {

            deletedAssets.forEach(x => { 
                        
                promises.push(this.dataService.delete("asset", x) )
            })            
        }

        // wait for all promises to finish

        if (promises.length > 0) {

            this.setState({loading: true});

            Promise.all(promises.map(p => p.catch(e => e)))
                .then(results => { 
                    console.log('all updates complete ', results); 

                    this.loadData() 
                })
                .catch(e => { 
                    console.log(e)
                    this.setState({loading: false});
                });
        }
        
    }  

    render() {

        const { centres, assets, centreId, loading } = this.state;   

        let cid = (!centreId && centres.length > 0) ? centres[0].id : centreId
        
        const filteredAssets = (assets && assets.length > 0) ? assets.filter(x => { return (x.cid === cid) }) : [];

        return (

            <div className='asset-manager'>       

                <div className='header'>

                    <button className='btn' onClick={this.loadData.bind(this) }>Search</button>

                    {
                        loading ?
                            <div className='loading'>loading...</div>
                            :
                            null
                    }

                    <button className='btn' onClick={this.onSave.bind(this) }>Save</button>

                </div>


                <Centres data={centres} onClick={this.onSelectCentre.bind(this)} onAdd={this.onAddCentre.bind(this)} onChange={this.onChangeCentre.bind(this)} onDelete={this.onDeleteCentre.bind(this)} />

                <Assets centreId={cid} data={filteredAssets} onAdd={this.onAddAsset.bind(this)} onChange={this.onChangeAsset.bind(this)} onDelete={this.onDeleteAsset.bind(this)} />                  

            </div>
        );
    }
}