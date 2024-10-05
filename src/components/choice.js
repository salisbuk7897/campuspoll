import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "./home.css";
import axios from 'axios';
const url = "http://localhost:4091";

function Choice({id}){
    const { state } = useLocation();
    const[poll, setPoll] = useState([]);
    const[vt, setvt] = useState(null)
    const[opt, setOpt] = useState([]);
    const [user, setUser] = useState(null)
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        try { 
            axios({
                method: 'post',
                url: `${url}/polls/getpoll`,
                headers: {'Content-Type': 'application/json',}, 
                data: {id:state.id},
                withCredentials: true})
            .then(function (response) {
                    var msg = response.data
                    //console.log(msg);
                    
                    try{
                        var c= msg[0].Options[0]
                        
                        const keys = Object.keys(c);
                        //console.log(keys[0])
                        setOpt(keys)
                        //console.log(opt)
                        setPoll(msg);

                    }catch(e){

                    }
                }
            );
        } catch (error) { 
        } 
    },[])

    useEffect(()=>{ const fetchData = async () => { 
        try { axios({method: 'get',
              url: `${url}/users/check`,
                  withCredentials: true}).then(function (response) {
                  //console.log(response.data);
                  setUser(response.data);
              });
        } catch (error) { 
          console.error(error);
        }
      }; 
        fetchData(); 
      },[])

    const handleRadio = (i, e) => {
        setvt(i);
        setSubmitted(false);
        //console.log(vt)
    };

    const renderRadio = (inputt) => {
        
        return (
            <div className="div-radio">
                <input 
                    id={inputt}
                    value={inputt} 
                    name="vote"
                    onChange={(e) => handleRadio(inputt, e)}
                    key={inputt}
                    type='radio' 
                /> 
                <label className='label-brand'>
                    <span style={{color: "white", fontSize: 20, marginLeft:"2%"}}>{inputt}</span>
                </label>
            </div>
        );
    }

    const handleVote = async (i,e) => {
        e.preventDefault();
        var val = {
            id:i,
            vote:vt,
            voter: user
        }
        //console.log(val)
        try { 
            axios({
                method: 'post',
                url: `${url}/polls/addvote`,
                headers: {'Content-Type': 'application/json',}, 
                data: val,
                withCredentials: true})
            .then(function (response) {
                    var msg = response.data
                    //console.log(msg);
                    if(msg.includes("vote Successful")){
                        setSubmitted(true);
                        setError(false);
                    }else{
                        //console.log("here 3")
                        setError(true);
                    }
                }
            );
        } catch (error) { 
            setError(true);
        } 
    }

    // Showing success message
    useEffect(() => {
        if(submitted){ 
            alert(
                `Vote has been casted successfully!!!`
            )
            navigate("/vote");
            window.location.reload();
        }else if(error){
            alert(
                `Casting Vote Failed!!`
            )
        }
    },[submitted, error]);

    return(
        <div className="App-header">
            {poll.length < 1 ? 
            "loading..." : 
            <div className="form-vote"> 
                <h4>Poll: {poll[0].id}</h4>
                <p>{poll[0].Poll}</p>
                {opt.map(renderRadio)}
                <button onClick={(e)=> handleVote(poll[0].id, e)} className="btn-right" style={{"float":"right"}} type="submit">
                    Cast Vote
                </button>
            </div> }
        </div>
    )

}

export default Choice;