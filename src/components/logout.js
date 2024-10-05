import { useNavigate,
} from 'react-router-dom';
import "./home.css"
import { useState, useEffect } from "react";
import axios from 'axios';
const url = "http://localhost:4091";

function Logout(){
    const navigate = useNavigate();

    useEffect(()=>{ const fetchData = async () => { 
        try { axios({method: 'get',
              url: `${url}/users/logout`,
                  withCredentials: true}).then(function (response) {
                  //console.log(response.data);
                  var msg = response.data;
                  if(msg === 'success'){
                    navigate('/');
                    window.location.reload();
                  }
              });
        } catch (error) { 
          console.error(error);
        }
      }; 
        fetchData(); 
      },[])
}

export default Logout;