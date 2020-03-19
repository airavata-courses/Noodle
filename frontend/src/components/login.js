import React, { useState } from "react";
import { Card, Form, Input, Button } from "antd";
import routes from "../routes";
import { bake_cookie} from 'sfcookies';
import axios from "axios";



const LoginPage = props => {   
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getFieldDecorator } = props.form;
  const cookie_key = 'email_name'; 


  const goToRegisterPage = (e) => {

    e.preventDefault();    
    props.history.push(routes.register);
  };
  const handleSubmit = (event) => {
    event.preventDefault();    
    localStorage.setItem("token", "I am now logged in");
    //console.log(this.state);    
    //console.log('Received values of form: ', values);
    
    //cookie.set(email);
    //cookie = "email" + email ;
    bake_cookie(cookie_key,email);
    //cookies.set()
    axios.post(process.env.USER_SERVICE+'/api/auth',{
          email: email,
          password:password})
            .then( (response)=> {
                // handle success
                if(response.data !== "Invalid credentials!")
                {
                  alert("Success Login");
                  props.history.push(routes.dashboard);
                }                
                console.log(response);
                //this.setState({prediction:response.data})

            },(error) =>{
              console.log(error);
            });        
  };
 

  //const { username, password} = this.state
  return (
    <>
      <Card
        bordered={false}
        style={{
          border: "1px solid #dcdcdc",
          boxShadow: "0px 15px 20px 5px #0000001a",
          width: 400
        }}
      >
        <h1 style={{ textAlign: "center" }}>Weather Application</h1>
        
        <Form
          hideRequiredMark
          colon={false}
          onSubmit={handleSubmit}
          layout="vertical"          
        >
          <Form.Item label="Email">
            {getFieldDecorator("email", {
              rules: [{ required: true, message: "Email required" }]
            })(<Input size="large" 
            placeholder="John@example.com"             
            value = {email}
            onChange = {e => setEmail(e.target.value)}
            />)}
          </Form.Item>
          <Form.Item label="Password">
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "Password required" }]
            })(
              <Input.Password
                size="large"
                type="password"
                placeholder="Password"
                value = {password}
                onChange = {e => setPassword(e.target.value)}
              />
            )}
          </Form.Item>
          <Button block size="large" htmlType="submit">
            Login
          </Button>
          <div>
              <p>
                <p></p>
              </p>
          </div>
         
        </Form>
        <div>
        <Button block size="large" onClick={goToRegisterPage} >Register</Button>
        </div>
      </Card>
    </>
  );
};

export default Form.create({ name: "Login" })(LoginPage);
