const express   = require('express'),
bodyParser      = require('body-parser'),
morgan          = require('morgan'),
jwt             = require('jsonwebtoken'),
config          = require('./config'),
DB              = require('./db'),
app             = express(); 

//set secret
app.set('Secret', config.secret);

// use morgan to log requests to the console

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const ProtectedRoutes = express.Router(); 

app.use('/api', ProtectedRoutes);

const db = new DB()

app.use((req, res, next) => {

    // we allow access from any host for the purposes of the test

    res.header("Access-Control-Allow-Origin", "*");   
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");

    // we need the access-token header for this to work

    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, access-token, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");      

    next();
});

ProtectedRoutes.use((req, res, next) => {

    res.header("Access-Control-Allow-Origin", "*");   
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");

    // we need the access-token header for this to work

    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, access-token, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");      

    // check header for the token
    var token = req.headers['access-token'];

    // decode token
    if (token) {

      // verifies secret and checks if the token is expired
      jwt.verify(token, app.get('Secret'), (err, decoded) =>{      

        if (err) {
          return res.json({ message: 'invalid token, try logging in again', data: [], status: false });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          next();
        }

      });

    } else {

      // if there is no token  

      res.send({ message: 'No token provided.', data: [], status: false });
    }
});

//-----------------------------------------------------------------
// routes

ProtectedRoutes.get('/centre', (req, res) => {

    db.findAll("centre").then(d => { res.json(d) })
})

ProtectedRoutes.post('/centre', (req, res) => {

    const data = req.body;
    db.insert("centre", data).then(d => { res.json(d) })
})

ProtectedRoutes.put('/centre', (req, res) => {

    const data = req.body;
    db.update("centre", data).then(d => { res.json(d) })
})

ProtectedRoutes.delete('/centre', (req, res) => {

    const data = req.body;
    db.delete("centre", data).then(d => { res.json(d) })
})

//-----------------------------------------------------------------

ProtectedRoutes.get('/asset', (req, res) => {

    db.findAll("asset").then(data => { res.json(data) })
})

ProtectedRoutes.post('/asset', (req, res) => {

    const data = req.body;
    db.insert("asset", data).then(d => { res.json(d) })
})

ProtectedRoutes.put('/asset', (req, res) => {

    const data = req.body;
    db.update("asset", data).then(d => { res.json(d) })
})

ProtectedRoutes.delete('/asset', (req, res) => {

    const data = req.body;
    db.delete("asset", data).then(d => { res.json(d) })
})

//-----------------------------------------------------------------


app.post('/authenticate', (req,res) => {

    // get a token

    // hard code username/password to admin/password

    const timeout = 20 * 60     // 20 minutes

    if (req.body.username === "admin") {

        if (req.body.password === 'password') {
           
            const payload = {check:  true};

            var token = jwt.sign(payload, app.get('Secret'), { expiresIn: timeout }); // expires in 24 hours

            res.json({
                message: 'user authentication success ',
                token: token,
                expiresIn: timeout,
                status: true
            });

        } else {
            res.json({message:"incorrect password !", token: null, expiresIn: 0, status: false})
        }

    } else {
        res.json({message:"user not found !", token: null, expiresIn: 0, status: false})
    }
})

function createDatabase() {

    db.createDatabase().then(() => {

        // seed the database

        const centerData = [{id: 1, name: 'Myer', address: "436 George St, Sydney NSW 2000"}, 
                            {id: 2, name: 'Westfields', address: "Pitt st"}];

        let i = 1;

        const assetData = [{id: i++, cid: 1, name: 'aaa', dimensions: '3x1', location: '1F south', status: true},
                        {id: i++, cid: 1, name: 'bbb', dimensions: '3x1', location: '2F north', status: true},
                        {id: i++, cid: 1, name: 'ccc', dimensions: '3x1', location: '3F centre', status: true},
                        {id: i++, cid: 1, name: 'ddd', dimensions: '3x1', location: '4F west', status: true},
                        {id: i++, cid: 1, name: 'eee', dimensions: '3x1', location: '5F centre', status: true},
                        {id: i++, cid: 1, name: 'fff', dimensions: '3x1', location: 'B south', status: true},
                        {id: i++, cid: 2, name: 'ggg', dimensions: '3x1', location: '1F south', status: true},
                        {id: i++, cid: 2, name: 'hhh', dimensions: '3x1', location: '2F south', status: true},
                        {id: i++, cid: 2, name: 'iii', dimensions: '3x1', location: '3F south', status: true},
                        {id: i++, cid: 2, name: 'jjj', dimensions: '3x1', location: '4F south', status: true},
        ];

        db.createCollection("centre", centerData)
        db.createCollection("asset", assetData)        
    })
}

// create and seed database

createDatabase()

const port = 3000

const server = app.listen(port, () => {

    console.log(`The server is running on http://localhost:${port}/ Make sure you have mongod running on your system`) 
});

app.get('/', (req, res) => {
        
    res.send(`The server is running on http://localhost:${port}/. Make sure you have mongod running on your system`);
});
