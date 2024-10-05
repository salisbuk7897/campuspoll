import "./navbar.css"
import { useState, useEffect } from "react";
import axios from 'axios';
const url = "http://localhost:4091";

function Navbarr() {
    const [data, setData] = useState(null)

    useEffect(()=>{ const fetchData = async () => { 
        try { axios({method: 'get',
              url: `${url}/users/check`,
                  withCredentials: true}).then(function (response) {
                  //console.log(response.data);
                  setData(response.data);
              });
        } catch (error) { 
          console.error(error);
        }
      }; 
        fetchData(); 
      },[])
  return (
    <nav className="navbar">
        <div className="navbar-left">
            <a href="/" className="logo">
            Campus Poll
            </a>
        </div>
        {data === false? "": <div className="navbar-center">
            <ul className="nav-links">
                <li>
                    <a href="/vote">Vote</a>
                </li>
                <li>
                    <a href="/addpoll">Add Poll</a>
                </li>
            </ul>
        </div>}
        <div className="navbar-right">
           {data === false  ? <ul className="nav-links">
                <li>
                    <a href="/register">Register</a>
                </li>
                <li>
                    <a href="/login">Login</a>
                </li>
            </ul>:
            <ul className="nav-links">
                <li>
                    <a href="/">Welcome {data}</a>
                </li>
                <li>
                    <a href="/logout">Log Out</a>
                </li>
                
            </ul>}
        </div>
    </nav>
    
  );
}

export default Navbarr;