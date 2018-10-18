import CookieTools from '../cookie/cookie'

export default class DataService {

    constructor() {

        this.url = 'http://localhost:3000'
    }

    login(username, password) {

        const url = this.url + "/authenticate"

        const data = {username: username, password: password}

        return fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',    
                },
                body: JSON.stringify(data), // body data name must match "Content-name" header          
                }
        )          
    }

    get(name) {
        
        const url = this.url + "/api/" + name

        //const token = sessionStorage.getItem("token");

        const token = CookieTools.getCookie("token")

        return new Promise((resolve, reject) => {

            fetch(url, {
                method: "GET",                            
                headers: {
                    'Content-Type': 'application/json',
                    "access-token": token,       
                }                             
            })
            .then(
                (response) => {
                if (response.status !== 200) {
                    let msg = 'Looks like there was a problem. Status Code: ' +  response.status
                    reject({data: [], err: msg});
                    return
                }
            
                response.json().then((data) => {
                    resolve(data);
                });
                }
            )
            .catch(function(err) {
                let msg = 'Fetch Error :-S ' + err

                reject({data: [], err: msg});
            });            
      });
    }  

    add(name, data) {
        
        const url = this.url + "/api/" + name

        const token = CookieTools.getCookie("token")

        return new Promise((resolve, reject) => {

            fetch(url, {
                method: "POST",                            
                headers: {
                    'Content-Type': 'application/json',
                    "access-token": token,       
                },
                body: JSON.stringify(data), // body data name must match "Content-name" header                             
            })
            .then(
                (response) => {
                if (response.status !== 200) {
                    let msg = 'Looks like there was a problem. Status Code: ' +  response.status
                    reject(msg);
                    return
                }
            
                response.json().then((d) => {
                    resolve(d);
                });
                }
            )
            .catch((err) => {
                let msg = 'Fetch Error :-S ' + err

                reject(msg);
            });            
      });
    } 

    update(name, data) {
        
        const url = this.url + "/api/" + name

        const token = CookieTools.getCookie("token")    

        return new Promise((resolve, reject) => {

            fetch(url, {
                method: "PUT",                            
                headers: {
                    'Content-Type': 'application/json',
                    "access-token": token,       
                },
                body: JSON.stringify(data), // body data name must match "Content-name" header                             
            })
            .then(
                (response) => {
                if (response.status !== 200) {
                    let msg = 'Looks like there was a problem. Status Code: ' +  response.status
                    reject(msg);
                    return
                }
            
                response.json().then((d) => {
                    resolve(d);
                });
                }
            )
            .catch((err) => {
                let msg = 'Fetch Error :-S ' + err

                reject(msg);
            });            
      });
    }   
    
    delete(name, data) {
        
        const url = this.url + "/api/" + name

        const token = CookieTools.getCookie("token")

        return new Promise((resolve, reject) => {

            fetch(url, {
                method: "DELETE",                            
                headers: {
                    'Content-Type': 'application/json',
                    "access-token": token,       
                },
                body: JSON.stringify(data), // body data name must match "Content-name" header                             
            })
            .then(
                (response) => {
                if (response.status !== 200) {
                    let msg = 'Looks like there was a problem. Status Code: ' +  response.status
                    reject(msg);
                    return
                }
            
                response.json().then((d) => {
                    resolve(d);
                });
                }
            )
            .catch((err) => {
                let msg = 'Fetch Error :-S ' + err

                reject(msg);
            });            
      });
    }        


}