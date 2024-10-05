import { useNavigate } from 'react-router-dom';
import "./home.css"
import { useState, useEffect } from "react";
import axios from 'axios';
const url = "http://localhost:4091"

function AddPoll(){
    const[onumber, setOnumber] = useState(2);
    const[opt, setOpt] = useState([1,2]);
    const[optValue, setOptValue] = useState({});
    const[apiValue, setapiValue] = useState({});
    const[poll, setPoll] = useState("");
    const[pollEndDate, setPollEndDate] = useState("");
    const[pollEndTime, setPollEndTime] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    // Handling the poll change
    const handlePoll = (e) => {
        setPoll(e.target.value);
        setSubmitted(false);
    };

    // Handling the poll end change
    const handlePollEndDate = (e) => {
        setPollEndDate(e.target.value);
        setSubmitted(false);
    };

    const handlePollEndTime = (e) => {
        setPollEndTime(e.target.value);
        setSubmitted(false);
    };

    // Handling the options change
    const handleOptions = (i, e) => {
        var b = optValue;
        b[i] = e.target.value
        setOptValue(b);
        setSubmitted(false);
        var ap = {};
        opt.map((input) => {
            ap[optValue[input]] = 0
        })
        setapiValue(ap)
    };

    const AddOption = (e) => {
        e.preventDefault();
        var c = onumber+1;
        setOnumber(c)
        var d = opt;
        d.push(c);
        setOpt(d)
    }

    // Handling the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (poll === "" || pollEndDate === "" || pollEndTime === "") {
            setError(true);
        } else {
            var val = {
                poll:`${poll}`,
                options:apiValue,
                ends: `${pollEndDate}T${pollEndTime}:00.000+00:00`
            }
            //console.log(val)
            try { 
                axios({
                    method: 'post',
                    url: `${url}/polls/addpoll`,
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
                setError(true);
            } 
        }
    };

    const renderInput = (input) => {
        // element index as key or reference is a horrible idea
        // for example if a new input is unshifted it will have the same 
        // reference or key, which will render the idea of key, reference invalid
      
        return (
          <input 
            id={input} 
            onChange={(e) => handleOptions(input, e)}
            className="input"
            key={input}
            type='text' 
          />
        );
    }

    // Showing success message
    useEffect(() => {
        if(submitted){ 
            alert(
                `Poll has been created successfully!!!`
            )
            navigate("/");
            window.location.reload();
        }else if(error){
            alert(
                `Adding Poll Failed!!`
            )
        }
    },[submitted, error]);

    return(
        <div className="App-header">
            <div className="form-poll">
                <div>
                    <h4 style={{"textAlign":"center"}}>Add Poll</h4>
                </div>

                <form>
                    {/* Labels and inputs for form data */}

                    <label className="label">Poll</label>
                    <input
                        onChange={handlePoll}
                        className="input"
                        value={poll}
                        type="text"
                    />

                    <label className="label">Options</label>
                    {opt.map(renderInput) }
                    <p></p>
                    <button onClick={AddOption} className="btn-right" style={{"float":"right"}} type="submit">
                        Add Option
                    </button>
                    <label className="label">Poll Ends</label>
                    <input
                        onChange={handlePollEndDate}
                        className="input"
                        value={pollEndDate}
                        type="date"
                    />
                    <input
                        onChange={handlePollEndTime}
                        className="input"
                        value={pollEndTime}
                        type="time"
                    />

                    
                    <p></p>
                    <button onClick={handleSubmit} className="btn" type="submit">
                        Create Poll
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddPoll