import React, { useState } from "react";
import { Row, Button } from "antd";

import routes from "../../routes";
import { read_cookie} from 'sfcookies';

const DashboardView = props => {
  const goToSettingsPage = (e) => {

    e.preventDefault();
    console.log(Date);
    props.history.push(routes.settings);
  };

  const goToStatsPage = (e) => {

    e.preventDefault();
    console.log(Date);
    props.history.push(routes.statistics);
  };


  const [Date,setDate] = useState('react');

  function handleChange(e){
    setDate(e.target.value);
 };
  

 function handleSubmit(e){
  e.preventDefault();
  console.log(Date);
};
  

  var email = '';

  email = read_cookie('email_name');
  
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
      Welcome  {email}
      </h2>
      <br></br>
      </center>
     
    </div>
    <div>
    <p>    
        Date   <select onChange={handleChange} value={Date}>
          <option value="1991">1991</option>
          <option value="1992">1992</option>
          <option value="1993">1993</option>
        </select>
        </p>
        </div>
        <div>
    <p>    
        Month   <select onChange={handleChange} value={Date}>
          <option value="1991">1991</option>
          <option value="1992">1992</option>
          <option value="1993">1993</option>
        </select>
        </p>
        </div>
        <div>
    <p>    
        Day   <select onChange={handleChange} value={Date}>
          <option value="1991">1991</option>
          <option value="1992">1992</option>
          <option value="1993">1993</option>
        </select>
        </p>
        </div>
        <div>
    <p>    
        Month   <select onChange={handleChange} value={Date}>
          <option value="1991">1991</option>
          <option value="1992">1992</option>
          <option value="1993">1993</option>
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
