import React, { useState } from "react";
import { Card, Form, Input, Button } from "antd";
import routes from "../routes";
import { bake_cookie} from 'sfcookies';
import axios from "axios";

import "../App.css"



  const RegisterPage = props => {   
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { getFieldDecorator } = props.form;
    const cookie_key = 'email_name'; 
  
  
    const goBack = () => {
        props.history.goBack();
      };
    const handleSubmit = (event) => {
      event.preventDefault();    
      localStorage.setItem("token", "I am now Registered in");
      //console.log(this.state);    
      //console.log('Received values of form: ', values);
      
      //cookie.set(email);
      //cookie = "email" + email ;
      bake_cookie(cookie_key,email);
      //cookies.set()
      axios.post('http://149.165.171.65:30001/api/user',{
            name: name,
            email: email,
            password:password},
            {headers:{'Access-Control-Allow-Origin': '*',
                        'Content-Type':'application/json'}})
              .then( (response)=> {
                  // handle success
                  if(response.data !== "Invalid credentials!")
                  {
                    alert("Success Registered");
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
              <Form.Item label="Name">
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "Name required" }]
              })(<Input size="large" 
              placeholder="John"             
              value = {name}
              onChange = {e => setName(e.target.value)}
              />)}
            </Form.Item>
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
                rules: [{ required: true, message: "Password required min 6 chars" }]
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
              Register
            </Button>
          </Form>
          <div>
              <p>

              </p>
          </div>
          <Button block size="large" onClick={goBack}>Back To Login</Button>
        </Card>
      </>
    );
  };
  
  export default Form.create({ name: "Register" })(RegisterPage);