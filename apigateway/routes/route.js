const axios = require('axios');

module.exports = function(app) {
        
    let task = require("./EventHandlers");
    const uuidv1 = require('uuid/v1');

    app.get("/session-message",function( req,res){

            let uid = uuidv1()
            msg = req.body
            console.log('msg = '+ msg)

            if(resMap[msg['username']] != null)
               {
                res.send(resMap[msg['username']])
               }
            else
                res.send('Error')
        
    });

    
    app.get("/session",function( req,res){

        msg = req.body
        id = req.query.username
        console.log(req.query.username);
       
        axios.get('session-service:5010/session-data?username='+ id).then(function(response) {
                console.log(response.data);
                res.send(response.data);
              });
    });

    app.post("/task",function( req,res){
            
            let uid = uuidv1()
            msg = req.body
            user = msg['user']
            let data = {"station":msg['station'],'user':user,'job':'data retrieval'}
            
            task.produce(data,'data-retrieve')

            data = {"station":msg['station'],"uid":uid,'user':user,'job':'data retrieval',status:'Retrieval Process Started'}
            res.send(data)

    });

};