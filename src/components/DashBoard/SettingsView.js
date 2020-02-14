import React, { useState } from "react";
import { Button } from "antd";
import { read_cookie} from 'sfcookies';
import { bake_cookie} from 'sfcookies';
import axios from "axios";
import routes from "../../routes";

//import data from "../../data.json"; 
const SettingsView = props => {
  const goBack = () => {
    props.history.goBack();
  };

  function set_change(e){
    setResult(e.data);
};

  var data = '';
  const [result, setResult] = useState('');
  var user = '';
 
  user = read_cookie('email_name');

  const myfunc = () =>{

    axios.get('http://localhost:5050/session-message',{
          username: user
          })
            .then( (response)=> {
                // handle success
                if(response.data )
                {
                  alert("Data Fetching");
                  
                 // data = response.data;
                  //console.log(data)
                  data = response.data
                  console.log(data)
                  
                }                
               // console.log(response);
                //this.setState({prediction:response.data})
 
            },(error) =>{
              console.log(error);
            });   
      

  }

  const my_result = () =>{
    return fetch('http://localhost:5050/session-message',{
      username: user
      }).then(response => response.json());
  };


  
 // const socialMediaList = data.SocialMedias;

return (
  
  
  <div>  
    Result :::

    {data}
    

    <tr>
      <td>
        {Object.keys(data)}
      </td>
    </tr>
      
 <center>
 <Button onClick={goBack}>Go back</Button>
 </center>
 <Button onClick={myfunc} >Update Status</Button>
  </div>  
    
 
  
  
  
);
};

export default SettingsView;

