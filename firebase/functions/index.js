const functions = require('firebase-functions');
const { firebaseConfig } = require('firebase-functions');
const {Firestore} = require('@google-cloud/firestore');

const admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors')  (  {
    origin: true
}  )   ;


exports.users = functions.https.onRequest( (request, response) =>{ 

    cors( request, response, ()=>
    {
        if(request.method === 'GET')
        {

            let userName = response.req.url.split('/')[1];
            let roomName = response.req.url.split('/')[2];
            let windowName = response.req.url.split('/')[4];
            // let ret = [];
            let last_time=0;
            admin.firestore().collection('users/'+userName+'/'+roomName+'/windows').get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // console.log(doc.id, " => ", doc.data(), doc.data().windows);
                    let x = {time: doc.data().time};

                    if(last_time<x.time)
                    {
                        last_time = x.time;
                    }
                    // ret.push(x);
                });
                response.json(JSON.stringify(last_time));
            });
        }
        if(request.method ==='POST')
        {
            let userName = response.req.url.split('/')[1];
            let roomName = response.req.url.split('/')[2];
            let windowName = response.req.url.split('/')[4];
            
            let time = Date.now();
            admin.firestore().collection('users/'+userName+'/'+roomName+'/windows').doc(windowName).set({
            // admin.firestore().collection('users/'+userName).doc(windowName).set({
            
                time : time}).then( () =>  {
                response.json(response.req.body);
            }) ;
        }
    }
    );
});

// 닫혀있을 때 마다 POST & GET
// POST 
// users/test/room1/windows/1

//curl -X POST http://localhost:5001/ventilation-notification/us-central1/users/test/room1/windows/1

// curl -X POST https://us-central1-yena-temp.cloudfunctions.net/users/test -H "Content-Type:application/json" -d '{"temp_body": 36.4, "temp_sensor" : 33.2}' 
