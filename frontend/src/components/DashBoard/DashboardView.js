import React, { useState } from "react";
import { Row} from "antd";
 
import routes from "../../routes";
import { read_cookie} from 'sfcookies';
// import { bake_cookie} from 'sfcookies';
import axios from "axios";
const DashboardView = props => {
  // const [url, setUrl] = useState("");
  var fetchedUrl = ""
  var user = '';
  const goToSettingsPage = (e) => {
 
    e.preventDefault();
    
    console.log(Date);         
    
    // if (Date === 1)
    // {
    //   url = "2019/06/26/KVWX/KVWX20190626_221105_V06";

    // }
    
    //cookies.set()
    axios.post('http://149.165.171.65:30002/task',{
          user: user,
          station:"2019/06/26/KVWX/KVWX20190626_221105_V06"})
            .then( (response)=> {
                // handle success
                if(response.data )
                {
                  //alert("Success Login");
                  // fetchedUrl = response.request.res.responseURL;
                  console.log(fetchedUrl);
                  props.history.push(routes.settings);
                }                
                console.log(response);
                //this.setState({prediction:response.data})
 
            },(error) =>{
              console.log(error);
            });   
 
    
  };
 
  const params = {
    username: user
    
  };
  // var my_user = ''
  
  const goToStatsPage = (e) => {
 
    e.preventDefault();
    axios.get('http://149.165.171.65:30002/session?username='+user,{params      
          },{headers:{'Access-Control-Allow-Origin': '*',
          'Content-Type':'application/json'}} )
            .then( (response)=> {
                // handle success
                if(response.data )
                {
                  //alert("Success Login");
                  // fetchedUrl = response.request.res.responseURL;
                  props.history.push(routes.statistics);
                }                
                console.log(response);
                //this.setState({prediction:response.data})
 
            },(error) =>{
              console.log(error);
            });   
    
    // props.history.push(routes.statistics);
  };
 
  // var user = '';
 
  user = read_cookie('email_name');
 
  // var station = '';
  // const handleSubmit = (event) => {
  //   event.preventDefault();    
  //   localStorage.setItem("token", "I am now logged in");
  //   //console.log(this.state);    
  //   //console.log('Received values of form: ', values);
    
  //   //cookie.set(email);
  //   //cookie = "email" + email ;
  //   if (Date === 1)
  //   {
  //     url = "2019/06/26/KVWX/KVWX20190626_221105_V06";

  //   }

    
  //   //cookies.set()
  //   axios.post('http://localhost:5000/api/auth',{
  //         user: user,
  //         station:"abc"})
  //           .then( (response)=> {
  //               // handle success
  //               if(response.data !== "Invalid credentials!")
  //               {
  //                 alert("Success Login");
  //                 props.history.push(routes.dashboard);
  //               }                
  //               console.log(response);
  //               //this.setState({prediction:response.data})
 
  //           },(error) =>{
  //             console.log(error);
  //           });        
  // };
 
 
  const [Date,setDate] = useState('react');
 
  function handleChange(e){
    setDate(e.target.value);
};
  
 

  
 
 
 
  //var url = ["1","2","3","4"]
 
  
  return (
    <form >
        <div>
      {/* Title of page */}
      <Row
        type="flex"
        justify="center"
        style={{ margin: "120px 0px 32px 0px" }}
      >        
      </Row>     
        
      <center>
      <h2>
      Welcome  {user}
      </h2>
      <br></br>
      </center>
     
    </div>
    <div>
    <p>    
        Search   <select onChange={handleChange} value={Date}>
          <option value="1">Address 1</option>
          <option value="2">Address 2</option>
          <option value="3">Address 3</option>
       </select>
        </p>
        </div>      
        
        
        <div>
        <button onClick={goToSettingsPage} type="submit">Run Command</button>
        </div>
        <p></p>
        <div>
          <p>          
        <button onClick={goToStatsPage} type="submit">Session</button>
          </p>
        </div>
      </form>
    
    
 
    
  );
};
 
export default DashboardView;

