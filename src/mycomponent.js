import React, { useEffect, useState } from 'react';
import axios from 'axios';
const url = "http://localhost:4091"
const MyComponent = () => { const [data, setData] = useState(null);
useEffect(() => { const fetchData = async () => { 
  try { axios({method: 'get',
        url: `${url}/api/data`,
            withCredentials: false}).then(function (response) {
            console.log(response);
            setData(response.data);
        });
  } catch (error) { 
    console.error(error);
  }
}; 
  fetchData(); 
}, []);
 
return ( 
  <div> {data ? ( <p>{data.message}</p> ) : ( <p>Loading data...</p> )} </div>
  );
};

export default MyComponent;