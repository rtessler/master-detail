mongo = require('mongodb');

var ObjectId = require('mongodb').ObjectID;

class MongoOps {

    // Make sure you have mongo installed and running on your system

    // https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/    

    constructor() {

        this.mongoClient = require('mongodb').MongoClient
        this.DBNAME = 'assetManager'
        const MONGO_PORT = 27017   

        this.dbServer = `mongodb://localhost:${MONGO_PORT}`
        
        this.url = this.dbServer + "/" + this.DBNAME;
    }

    createDatabase() {

        console.log(`Creating/Connecting to Mongo database: ${this.url}`)

        const self = this;

        const url = this.dbServer + "/" + this.DBNAME;

        return new Promise((resolve, reject) => {

            this.mongoClient.connect(url, function(err, db) {

                if (err) {
                    //throw err;

                    reject({status: false, msg: 'error creating database'});   
                }

                console.log(`Database created!`);
                db.close();
                resolve({status: true, msg: ""});
            });
        });
    }

    createCollection(name, data) {

        // create a mongo db collection
        // seed it with data

        const self = this;

        this.mongoClient.connect(this.dbServer, function(err, db) {

            if (err) throw err;

            var dbo = db.db(self.DBNAME);

            dbo.createCollection(name, (err, res) => {

                if (err) throw err;

                console.log(`Collection ${name} created!`);

                //db.close();

                // delete previous contents

                dbo.collection(name).deleteMany({}, (err, obj) => {

                    if (err) throw err;

                    console.log(obj.result.n + " document(s) deleted");

                    db.close();

                    // insert some data

                    //data.map(d => { self.insert(name, d) })

                    self.insert(name, data)

                });            
                
            });
        });
    }

    insert(collectionName, data) {

        // insert an array of objects into a collection

        const self = this;
    
        return new Promise((resolve, reject) => {

            if (!data || data.length == 0) {
                console.log(`0 ${collectionName} document inserted`);
                resolve('no data')
                return
            }

            this.mongoClient.connect(self.dbServer, (err, db) => {

                if (err) {
                    //throw err;
                    reject(err)
                    return;
                }

                var dbo = db.db(self.DBNAME);

                dbo.collection(collectionName).insertMany(data, (err, res) => {

                    if (err) {
                        //throw err;
                        console.log(err);
                        db.close();
                        reject(err)
                        return
                    } 

                    console.log(`${data.length} ${collectionName} document inserted`);

                    db.close();

                    resolve(res.result)
                });
            }); 
        });
    }  

    update(collectionName, data) {

        const self = this;

        return new Promise((resolve, reject) => {     
            
            if (!data) {
                console.log(`0 ${collectionName} documents updated`);
                resolve('no data')
                return
            }          
                   
            this.mongoClient.connect(self.dbServer, function(err, db) {

                if (err) {
                    //throw err;
                    reject(err)
                    return;                    
                }
                
                var dbo = db.db(self.DBNAME);

                var myquery = { "_id": ObjectId(data._id) };

                // delete _id field

                delete data._id;

                var newvalues = { $set: data };

                dbo.collection(collectionName).updateOne(myquery, newvalues, (err, res) => {

                    if (err) {
                        //throw err;
                        console.log(err);
                        reject(err)
                        db.close();
                        return
                    } 

                    console.log("1 document updated");
                    db.close();
                    resolve(res.result)
                })
            })
        })
    }

    delete(collectionName, data) {

        const self = this;
    
        return new Promise((resolve, reject) => {             

            if (!data) {
                console.log(`0 ${collectionName} documents deleted`);
                resolve('no data')
                return
            }                

            this.mongoClient.connect(self.dbServer, function(err, db) {

                if (err) {
                    //throw err;
                    reject(err)
                    return;                    
                }

                var dbo = db.db(self.DBNAME);

                var myquery = { "_id": ObjectId(data._id) };
                
                dbo.collection(collectionName).deleteOne(myquery, (err, res) => {

                    if (err) {
                        //throw err;
                        db.close();
                        reject(err)
                        return
                    } 

                    console.log("1 document deleted");
                    db.close();
                    resolve(res.result)
                })
            })
        })

    }
    
    findAll(collectionName) {

        // return an entire collection

        const self = this;

        return new Promise((resolve, reject) => {

            this.mongoClient.connect(self.dbServer, (err, db) => {

                if (err) {
                    //throw err;
                    reject({data: [], err: err});
                    return;
                }

                var dbo = db.db(self.DBNAME);

                dbo.collection(collectionName).find({}).toArray((err, result) => {

                    if (err) {
                        //throw err;
                        reject({data: [], err: err});
                        return;
                    }                        

                    db.close();

                    resolve({data: result});
                });
            });
        });
    }
}

module.exports = MongoOps;