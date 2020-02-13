import React from "react";
import { Button } from "antd";
import { read_cookie} from 'sfcookies';

const StatisticsView = props => {
  const goBack = () => {
    props.history.goBack();
  };

  var email = '';

  email = read_cookie('email_name');
  return (
    <div style={{ marginTop: 120, textAlign: "center" }}>
      <h2>Sessions View</h2>
      <h3>{email}</h3>
      <Button onClick={goBack}>Go back</Button>
    </div>
  );
};

export default StatisticsView;
