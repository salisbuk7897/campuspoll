import { useNavigate} from 'react-router-dom'
import "./home.css"
import { useState, useEffect } from "react";
import axios from 'axios';
const url = "http://localhost:4091"



function Register() {
    // States for registration
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [regNo, setRegNo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [matched, setMatched] = useState("N");
    const navigate = useNavigate();

    // States for checking the errors
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    // Handling the name change
    const handleFirstName = (e) => {
        setFirstName(e.target.value);
        setSubmitted(false);
    };

    const handleLastName = (e) => {
        setLastName(e.target.value);
        setSubmitted(false);
    };

    // Handling the email change
    const handleEmail = (e) => {
        setEmail(e.target.value);
        setSubmitted(false);
    };

    const handleRegNo = (e) => {
        setRegNo(e.target.value);
        setSubmitted(false);
    };

    const handleUsername = (e) => {
        setUsername(e.target.value);
        setSubmitted(false);
    };

    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setSubmitted(false);
    };

    const handleCPassword = (e) => {
        setCPassword(e.target.value);
        setSubmitted(false);
    };

    // Handling the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (firstname === "" || lastname === "" || email === "" ||regNo === "" || username === "" || password === ""|| cpassword === "") {
            console.log("here")
            setError(true);
        } else {
            var val = {
                fname:`${firstname}`,
                lname:`${lastname}`,
                mname:"",
                email:`${email}`,
                reg:`${regNo}`,
                username:`${username}`,
                password:`${password}` }
            try { 
                axios({
                    method: 'post',
                    url: `${url}/users/adduser`,
                    headers: {'Content-Type': 'application/json',}, 
                    data: val,
                    withCredentials: true})
                .then(function (response) {
                        var msg = response.data
                        //console.log(msg);
                        if(msg.includes("Added Successfully")){
                            setSubmitted(true);
                            setError(false);
                        }else{
                            console.log("here 3")
                            setError(true);
                        }
                    }
                );
            } catch (error) { 
                console.log(e)
                setError(true);
            }
        }
    };

    // Showing success message
    useEffect(() => {
        if(submitted){ 
            alert(
                `User ${firstname} ${lastname} successfully registered!!`
            )
            navigate("/");
            window.location.reload();
        }else if(error){
            alert(
                `Registration Failed!!`
            )
        }
        
    },[submitted, error]);

    useEffect(()=>{
        if(cpassword !== "" && cpassword !== password){
            setMatched("NM")
        }else if(cpassword !== "" && cpassword === password){
            setMatched("PM")
        }
    },[cpassword, password])

    return (
        <div className="App-header">
            <div className="form">
                <div>
                    <h4 style={{"text-align":"center"}}>User Registration</h4>
                </div>

                <form>
                    {/* Labels and inputs for form data */}
                    <label className="label">First Name</label>
                    <input
                        onChange={handleFirstName}
                        className="input"
                        value={firstname}
                        type="text"
                    />

                    <label className="label">Last Name</label>
                    <input
                        onChange={handleLastName}
                        className="input"
                        value={lastname}
                        type="text"
                    />

                    <label className="label">Email</label>
                    <input
                        onChange={handleEmail}
                        autocomplete="off"
                        className="input"
                        value={email}
                        type="email"
                    />

                    <label className="label">Reg No.</label>
                    <input
                        onChange={handleRegNo}
                        className="input"
                        value={regNo}
                        type="text"
                    />

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
                        autoComplete="off"
                        className="input"
                        value={password}
                        type="password"
                    />

                    <label className="label">Comfirm Password</label>
                    <input
                        onChange={handleCPassword}
                        className="input"
                        value={cpassword}
                        type="password"
                    />

                    <h6>{matched === "N" ? "": matched=== "NM" ? "Passwords did not Match": "Passwords Matched"}</h6>
                    
                    <button onClick={handleSubmit} className="btn" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}



export default Register;