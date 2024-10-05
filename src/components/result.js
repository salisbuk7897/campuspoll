'use client'
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "./home.css";
import axios from 'axios';
import { color } from "chart.js/helpers";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const url = "http://localhost:4091";


function Result(){
    //const [id, setId] = useState(1)
    const { state } = useLocation();
    const navigate = useNavigate();
    const [keyss, setKeyss] = useState([])
    const [vals, setVals] = useState([])
    const [bccl, setBccl] = useState([])
    const [bdcl, setBdcl] = useState([])
    const [poll, setPoll] = useState("")
    const colorss = ["aqua", "green", "red", "yellow", "purple", "violet", "blue", "pink"]

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
                        setPoll(msg[0].Poll)
                        var c= msg[0].Options[0]
                        const keys = Object.keys(c);
                        //console.log(keys[0])
                        setKeyss(keys)
                        //console.log(opt)
                        const nums = Object.values(c)
                        setVals(nums);
                        var v = colorss;
                        var bc = []
                        for(let i=0; i<keys.length; i++){
                            const random = Math.floor(Math.random() * v.length);
                            bc.push(v[random])
                            v.splice(random, 1)
                        }
                        var w = colorss
                        var bd = []
                        for(let i=0; i<keys.length; i++){
                            const random = Math.floor(Math.random() * w.length);
                            bd.push(w[random])
                            w.splice(random, 1)
                        }
                        setBccl(bc)
                        setBdcl(bd)

                        //console.log(bccl)
                        //console.log(bdcl)

                    }catch(e){

                    }
                }
            );
        } catch (error) { 
        } 
    },[])

    return(
        <div className="App-header">
            {bdcl.length< 1 ? "loading....":  <div><h4>{poll}</h4>
            <div style={{ maxWidth: "650px", color: "white", }}>
                <Bar
                    data={{
                        // Name of the variables on x-axies for each bar
                        labels: keyss,
                        datasets: [
                            {
                                // Label for bars
                                label: "total count/value",
                                // Data or value of your each variable
                                data: vals,
                                // Color of each bar
                                backgroundColor: 
                                    bccl,
                                // Border color of each bar
                                borderColor: bdcl,
                                borderWidth: 0.5,
                                color: "white",
                            },
                        ],
                    }}
                    // Height of graph
                    height={400}
                    color="white"
                    options={{
                        datalabels: {
                            color: "white",
                            font: {
                              weight: 'bold',
                              size:14,
                              family: 'poppins',
                              color:"white"
                            },
                          },
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                  // The y-axis value will start from zero
                                        beginAtZero: true,
                                    },
                                },
                            ],
                        },
                        legend: {
                            labels: {
                                fontSize: 15,
                                color: "white"
                            },
                            color: "white",
                        },
                    }}
                />
            </div></div>}
        </div>
    )
}

export default Result;