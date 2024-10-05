import { userdocs as _userdocs } from "../models/users.js";
let userdocs = _userdocs;
//import { genSaltSync, hashSync, compare } from 'bcryptjs';
import pkg from 'bcryptjs';
const { genSaltSync, hashSync, compare } = pkg;
//import { verify, sign } from "jsonwebtoken";
import pkgj from 'jsonwebtoken';
const { verify, sign } = pkgj;
import * as configg from "../../config.json" assert { type: "json" };

import { countdocs as _countdocs } from "../models/counter.js";
let countdocs = _countdocs;

import { MongoClient } from 'mongodb';

//console.log(configg.default)
let config = configg.default;
const mongourl = config.mongourl;
const mongoport = config.mongoport;
const dbname = config.dbname;
const dbauth = config.useDbAuth;
const dbuser = config.dbUser;
const dbpwd = config.dbPassword;
const authSource = config.authSource;
var jwtSecretToken = config.JWTSecretToken;

const dbURI = `mongodb://${mongourl}:${mongoport}/${dbname}?compressors=zlib`; //no authentication
const dbURIAuth = `mongodb://${mongourl}:${mongoport}/${dbname}?authSource=${authSource}&compressors=zlib`; //with authentication


async function SaveUser(req, u_id, fn){
    var userReq;
    var userExists = await userdocs.find({ Username: req.body.username }).exec();
    if(userExists.length>=1){
        userReq = "UE" //user exists
    }else{
        const Salt = genSaltSync()
    const hashedpassword = hashSync(req.body.password, Salt)
    var user = new userdocs({ 
        datetime: new Date(),
        Fname: req.body.fname,
        Lname: req.body.lname,
        Mname: req.body.mname,
        Email: req.body.email,
        Regnumber: req.body.reg,
        Username: req.body.username,
        Password : hashedpassword,
        User_ID: u_id
    }) 
    userReq = await user.save({})
    }
    
    fn(userReq)
}

async function generate_ID(sequence_value, fn){
    var User_ID;
    if(sequence_value <= 9){
        User_ID = `cp-00${sequence_value}`
    }else if(sequence_value <= 99){
        User_ID = `cp-0${sequence_value}`
    }else{
        User_ID = `cp-${sequence_value}`
    }
    fn(User_ID)
}

export async function AddUser(req, res ){
    //console.log(req.body)
    try{ 
        var counter = await countdocs.find({ ID: 'users' }).exec();
        if (counter.length <= 0){
            try{ 
                var count = new countdocs({ // Push the following key value pairs as subdocument
                    ID: 'users',
                    sequence_value: 1
                })
                const countReq = await count.save({}) 
                if(countReq["sequence_value"] == 1){ 
                    console.log("Users Count Started Added Successfully")
                    generate_ID(1, function(user_id){
                        if(user_id.startsWith('cp-')){
                            SaveUser(req, user_id, function(data){
                                if (data == "UE"){
                                    res.send("Username Exists")
                                } else if(data["User_ID"].startsWith('cp-')){
                                    return res
                                        .cookie("cpoll_jwt",req.body.username, { httpOnly: true, maxAge: 3600000 })
                                        .send(`User ${user_id} Added Successfully`)  
                                }else{
                                    res.send("Adding User Failed") 
                                }
                            })
                        }
                    })
                    
                }else{
                    res.send("Adding User count Failed") 
                }
            }catch(e){
                //console.log(e)
                res.send("count Request Error") 
            }
        }else{
            var updated_sv = counter[0]["sequence_value"] + 1;
            var resp = await countdocs.updateOne({ ID: 'users' }, { sequence_value: updated_sv });
            if (resp['acknowledged'] === true){
                generate_ID(updated_sv, function(user_id){
                    if(user_id.startsWith('cp-')){
                        SaveUser(req, user_id, async function(data){
                            if (data == "UE"){
                                var updated_sv1 = updated_sv - 1;
                                var resp = await countdocs.updateOne({ ID: 'users' }, { sequence_value: updated_sv1 });
                                res.send("Username Exists")
                            } else if(data["User_ID"].startsWith('cp-')){
                                return res
                                    .cookie("cpoll_jwt",req.body.username, { httpOnly: true, maxAge: 3600000 })
                                    .send(`User ${user_id} Added Successfully`) 
                            }else{
                                res.send("Adding User Failed") 
                            }
                        })
                    }
                })
                
            }else{
                res.send("Updating User Count Failed") 
            }
        }
    }catch(e){
        //console.log(e)
        res.send("New User Request Error")
    }
}


const jwtVerify = (token, secret) =>
    new Promise((resolve, reject) => {
      verify(token, secret, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  
const getJwt = (req) => {
    var tk;
    try{
        tk = req.headers["authorization"].split(" ")[1]; 
    }catch(e){
        tk = null
    }
    return tk
}
  
export async function handleLogin(req, res) {
    const token = getJwt(req);

    if (!token) {
    res.json({ loggedIn: false });
    return;
    }

    jwtVerify(token, jwtSecretToken)
    .then(async (decoded) => {
        var userExists = await userdocs.find({ Username: decoded.username }).exec();
        if (userExists.length=== 0) {
            res.json({ loggedIn: false, token: null });
            return;
        } else {
            
            res.json({
                loggedIn: true,
                token,
                user_id: userExists[0].User_ID,
                username: userExists[0].Username,
            });
        }
    })
    .catch(async () => {
        res.json({ loggedIn: false });
    });
}


const jwtSign = (payload, secret, options) =>
    new Promise((resolve, reject) => {
      sign(payload, secret, options, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });

export async function LoginUser(req, res) {
    var userExists = await userdocs.find({ Username: req.body.username }).exec();
    if(userExists.length>=1){
        const correctPassword = await compare(
            req.body.password,
            userExists[0].Password
        ); 
        if (correctPassword) {
            jwtSign(
              {
                username: userExists[0].Username,
                user_id: userExists[0].User_ID,
              },
              jwtSecretToken,
              { expiresIn: "1d" } //can change to "1min" to test logic when token expires
            )
            .then((token) => {
                //req.session.username = userExists[0].Username;
                //req.session.password = userExists[0].Password;
                return res
                    .cookie("cpoll_jwt",userExists[0].Username, { httpOnly: true, maxAge: 3600000 })
                    .status(200)
                    .json({
                        loggedIn: true,
                        token,
                        user_id: userExists[0].User_ID,
                        username: userExists[0].Username,
                    });
              })
              .catch((err) => {
                console.log(err);
                res.json({
                  loggedIn: false,
                  status: "Something went wrong, try again later",
                });
              });
        } else {
            res.json({
              loggedIn: false,
              status: "Wrong username, email or password!",
            });
        }
    } else {
        res.json({ loggedIn: false, status: "Wrong username, email or password!" });
    }
}