import React  from "react";
import { Button } from "antd";
import { read_cookie} from 'sfcookies';
import useAxios from 'axios-hooks'

var user = '';
 
user = read_cookie('email_name');
  


const StatisticsView = props => {


  const goBack = () => {
    props.history.goBack();
  };

  

  const [{ data, loading, error }, refetch] = useAxios(
    'http://149.165.171.65:30002/session-message/username='+user
  )

  console.log(user);
  
 
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>

  return (
    <div>
      <p>
        <p>
          <p>

          </p>
        </p>
      </p>
      <center>
      <Button onClick={refetch}>refetch</Button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
  {/* <pre>{JSON.stringify(data,null ,5)}</pre> */}
      </center>

      <center>
 <Button onClick={goBack}>Go back</Button>
 </center>
    </div>
  )
};





export default StatisticsView;
