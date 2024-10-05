import { useNavigate,
  } from 'react-router-dom';
import "./home.css"
import { useState, useEffect } from "react";
import axios from 'axios';
const url = "http://localhost:4091";

function Login(){
    // States for login
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // States for checking the errors
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();


    const handleUsername = (e) => {
        setUsername(e.target.value);
        setSubmitted(false);
    };

    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setSubmitted(false);
    };

    // Handling the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === "" || password === "") {
            setError(true);
        } else {
            var val = {
                username:`${username}`,
                password:`${password}` }

            try { 
                axios({
                    method: 'post',
                    url: `${url}/users/login`,
                    headers: {'Content-Type': 'application/json',}, 
                    data: val,
                    withCredentials: true})
                .then(function (response) {
                        var msg = response.data
                        
                        if(msg["loggedIn"] === true){
                            setSubmitted(true);
                            setError(false);
                        }else{
                            setError(true);
                        }
                    }
                );
            } catch (error) { 
                setError(true);
            }
        }
    };

    // Showing success message
    useEffect(() => {
        
        if(submitted){ 
            alert(
                `User ${username} successfully logged in!!`
            )
            navigate('/');
            window.location.reload();
        }else if(error){
            alert(
                `Login Failed!!`
            )
        }
    },[submitted, error]);

    return (
        <div className="App-header">
            <div className="form-login">
                <div>
                    <h4 style={{"textAlign":"center"}}>User Login</h4>
                </div>

                <form>
                    <label className="label">Username</label>
                    <input
                        onChange={handleUsername}
                        className="input"
                        value={username}
                        type="text"
                    />

                    <label className="label">Password</label>
                    <input
                        onChange={handlePassword}
                        className="input"
                        value={password}
                        type="password"
                    />
                    <p></p>
                    <button onClick={handleSubmit} className="btn" type="submit">
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );

}

export default Login;