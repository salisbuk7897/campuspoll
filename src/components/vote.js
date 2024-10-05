import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./home.css";
import axios from 'axios';
const url = "http://localhost:4091";

function Vote(){
    const[polls, setPolls] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        try { axios({method: 'get',
            url: `${url}/polls/getpolls`,
                withCredentials: true}).then(function (response) {
                //console.log(response.data);
                setPolls(response.data);
            });
      } catch (error) { 
        console.error(error);
      }
    },[])

    useEffect(()=>{
        try { 

      } catch (error) { 
        console.error(error);
      }
    },[polls])

    const handleVote = async (i,e) => {
        e.preventDefault();
        navigate('/choice', { state: {id:i} })
    }

    const handleResult = async (i,e) => {
        e.preventDefault();
        navigate('/result', { state: {id:i} })
    }

    const renderVotes = (vote) => {
        // element index as key or reference is a horrible idea
        // for example if a new input is unshifted it will have the same 
        // reference or key, which will render the idea of key, reference invalid
        var vdate = new Date(vote.Ends);
        var cdate = new Date();
        //console.log(vdate)
        //console.log(cdate)
        var stt = vdate > cdate;
        var cf;
        if (stt === false){
            cf = 'Ended'
        }else{
            cf = 'Active'
        }
        console.log(stt)
      
        return (
            <div className="boxx">
                <h4>Poll {vote.id}</h4>
                <p>{vote.Poll}</p>
                <p>Status: <span style={{"fontWeight":"bold"}}>{cf}</span></p>
                <button onClick={(e)=> handleResult(vote.id, e)} className="btn-right" style={{"float":"right", "marginRight": "1%"}} type="submit">
                    Result
                </button>
                <button disabled={!stt} onClick={(e)=> handleVote(vote.id, e)} className="btn-right" style={{"float":"right","marginRight": "1%"}} type="submit">
                    Vote
                </button>
                
                
            </div>
        );
    }

    return(
        <div className="App-header">
            <div className="form-vote">
                {polls.map(renderVotes) }
            </div>
        </div>
    )
}

export default Vote;