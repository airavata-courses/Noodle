import React , {useState, useEffect} from "react";
import { Button } from "antd";
import { read_cookie} from 'sfcookies';
import axios from "axios";
const StatisticsView = props => {
  const goBack = () => {
    props.history.goBack();
  };
  const useEndpoint = (req) =>{
    const [res, setRes] = useState({
      data: null,
      complete: false,
      pending: false,
      error: false
    });
    useEffect(() => {
      setRes({
        data: null,
        pending: true,
        error: false,
        complete: false
      });
      axios(req)
        .then(res =>
          setRes({
            data: res.data,
            pending: false,
            error: false,
            complete: true
          })
        )
        .catch(() =>
          setRes({
            data: null,
            pending: false,
            error: true,
            complete: true
          })
        );
        
    }, [req.url]);
    return res;
  }
  const App = () => {
    const todosApi = "https://5050/session-message";
    const [count, setCount] = useState(1);
    const todo = useEndpoint({
      method: "GET",
      url: `${todosApi}/${count}`
    });
  }

  var email = '';

  email = read_cookie('email_name');
  return (
    <div style={{ marginTop: 120, textAlign: "center" }}>
      <h2>Sessions View</h2>
      <h3>{email}</h3>
      <div>
      <button onClick={useEndpoint}>Session Status</button>
      
      

      {/* <div>
        {(todo.pending && "Loading...") || (todo.complete && todo.data.title)}
      </div> */}
    </div>

      <Button onClick={goBack}>Go back</Button>
    </div>
  );
};

export default StatisticsView;
