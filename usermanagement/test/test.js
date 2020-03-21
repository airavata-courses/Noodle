const request = require('supertest');
const user = require('../models/User.js');
const { register, login} = require('../routes/api/auth');

let login_data={email:"nayshaik@iu.edu",
     password:"nayshaik"
}
let register_data = {
    name: 'nayshaik',
    email: 'nayshaik@iu.edu',
    password: 'nayshaik'
};

describe('Testing register', function () {
    it('Case 1 : Existing user', function(done){
                
        request("http://localhost:5000")
        .post('/api/user',register)
        .send(register_data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /JSON/)
        .expect(204,done())
    });  
});

describe('Testing  register', function () {
    it('Case 1 : Existing user', function(done){
        let register_data={name: "nayshaik", email:"nayshaik@iu.edu", password:"nays"};   
        request("http://localhost:5000")
        .post('/api/user',register)
        .send(register_data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /JSON/)
        .expect(204,done())
    });  
});

describe('Testing login', function(){
        it(' Case: Successful login', function(){
            request('http://localhost:5000')
            .post('/api/auth', login)
            .send(login_data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /JSON/)
            .expect(200,user)
        });

        
    });
describe('Testing login', function(){
        it(' Case: Unsuccessful login', function(){
            let login_data={email:"nayshaik@iu.edu", password:"nays"};
            request('http://localhost:5000')
            .post('/api/auth', login)
            .send(login_data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /JSON/)
            .expect(401,user);
        });
    });