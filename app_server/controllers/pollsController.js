import { polldocs as _polldocs } from "../models/polls.js";
let polldocs = _polldocs;
import * as configg from "../../config.json" assert { type: "json" };

import { countdocs as _countdocs } from "../models/counter.js";
let countdocs = _countdocs;


async function SavePoll(req, sv, fn){
    var pollReq;
    try{
        var poll = new polldocs({ 
            datetime: new Date(),
            id: sv,
            Poll: req.body.poll,
            Options: req.body.options,
            Ends: new Date(req.body.ends),
            Voters: []
        }) 
        pollReq = await poll.save({})

    }catch(e){
        pollReq = "PE"
    }
    
    fn(pollReq)
}

export async function getPoll(req, res ){
    var counter = await polldocs.find({ id: req.body.id }).exec();
    res.json(counter)
    /* var counter = await polldocs.find({"Options.0.Yes" : 0}).exec();
    res.json(counter) */
}

export async function getPolls(req, res ){
    var counter = await polldocs.find({ }).exec();
    res.json(counter)
    /* var counter = await polldocs.find({"Options.0.Yes" : 0}).exec();
    res.json(counter) */
}

export async function castVote(req, res ){
    var updatedVoteCount;
    var updatedVoters;
    var counter = await polldocs.find({ id: req.body.id }).exec();
    if(counter.length <= 0){
        res.send("poll does not exist")
    }else if (new Date() >= counter["Ends"]){
        res.send("Voting has Ended")
    }else{
        updatedVoteCount = counter[0].Options[0][req.body.vote] + 1
        updatedVoters = (counter[0].Voters).push(req.body.voter)
        var resp =  await polldocs.updateOne(
            { id: req.body.id }, // Use _id for MongoDB document ID
            { 
              $set: { [`Options.0.${req.body.vote}`]: updatedVoteCount }, // Increment using $inc
              $push: { "Voters": req.body.voter } // Add voter ID if not already present
            }
          );//await polldocs.updateOne({ id: req.body.id}, { $set: { [`Options.$.${req.body.vote}`]: updatedVoteCount, "Voters": counter[0].Voters}});
        if (resp['acknowledged'] === true){
            res.send("Casting vote Successful")
        }else{ 
            res.send("Casting vote failed")
        }
    }
    //res.json({"ct": `Options.$.${req.body.vote}` })
}

export async function CreatePoll(req, res ){
    try{
        var counter = await countdocs.find({ ID: 'polls' }).exec();
        if (counter.length <= 0){
            var count = new countdocs({ // Push the following key value pairs as subdocument
                ID: 'polls',
                sequence_value: 1
            })
            const countReq = await count.save({})
            if(countReq["sequence_value"] == 1){ 
                SavePoll(req, countReq["sequence_value"], function(data){
                    if (data == "PE"){
                        res.send("Saving Poll Error")
                    }else{
                        res.send("Poll Added Successfully") 
                    }
                })
            }else{
                res.send("Adding Poll Count Failed") 
            }
        }else{
            var updated_sv = counter[0]["sequence_value"] + 1;
            var resp = await countdocs.updateOne({ ID: 'polls' }, { sequence_value: updated_sv });
            if (resp['acknowledged'] === true){
                SavePoll(req, updated_sv, function(data){
                    if (data == "PE"){
                        res.send("Saving Poll Error")
                    }else{
                        res.send("Poll Added Successfully") 
                    }
                })
                
            }else{
                res.send("Updating Poll Count Failed") 
            }
        }
    }catch(e){
        res.send("Creating poll failed!")
    }
}