import pkg from 'mongoose';
const { connect, createConnection, connection } = pkg;
import './polls.js';
import './users.js';
import * as configg from "../../config.json" assert { type: "json" };

import { countdocs as _countdocs } from "./counter.js";
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

let conn = null;
const activities = [ 'countactivities', 'pollactivities', 'useractivities'];

const dbURI = `mongodb://${mongourl}:${mongoport}/${dbname}?compressors=zlib`; //no authentication
const dbURIAuth = `mongodb://${mongourl}:${mongoport}/${dbname}?authSource=${authSource}&compressors=zlib`; //with authentication
//console.log(dbURIAuth)
if (dbauth === 'true'){
    connect(dbURIAuth, { 
        auth:{authdb: authSource},
        user: dbuser,
        pass: dbpwd
    }).then(() => {
        console.log('Authentication successful');
        conn = createConnection(`mongodb://${dbuser}:${dbpwd}@${mongourl}:${mongoport}/${dbname}?authSource=${authSource}&compressors=zlib`);
        conn.on('open', function(){
            conn.db.listCollections({name: 'useractivities'})
            .next(function(err, collinfo) {
                if(err){
                    console.log("error Connecting to database")
                } 
                if (collinfo) {
                    console.log("Collecions exist");
                }else{
                    for(i in activities){
                        conn.db.createCollection(activities[i],{storageEngine: {wiredTiger: {configString: 'block_compressor=zlib'}}});
                        /* if(activities[i] != "countactivities"){
                            addCounter(activities[i])
                        } */
                        console.log(`${activities[i]} Collection Created`)
                    }
                }
            });
        });
    }).catch(err => { 
        console.log('Authentication Failed');
    });
}else{
    connect(dbURI);
    conn = createConnection(dbURI);
    conn.on('open', function(){
        conn.db.listCollections({name: 'useractivities'})
        .next(function(err, collinfo) {
            if(err){
                console.log("error Connecting to database")
            } 
            if (collinfo) {
                console.log("Collecions exist");
            }else{
                for(i in activities){
                    conn.db.createCollection(activities[i],{storageEngine: {wiredTiger: {configString: 'block_compressor=zlib'}}});
                    /* if(activities[i] != "countactivities"){
                        addCounter(activities[i])
                    } */
                    console.log(`${activities[i]} Collection Created`)
                }
            }
        });
    });
}
 
import { createInterface } from "readline";
if (process.platform === "win32"){
    const rl = createInterface ({
    input: process.stdin,
    output: process.stdout
    });
    rl.on ("SIGINT", function (){
    process.emit ("SIGINT");
    });
}

connection.on('connected', function () {
    console.log('Mongoose connected to database');
});
connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

const gracefulShutdown = function (msg, callback) {
    connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
    });
};

process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
    });
});
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
    process.exit(0);
    });
});
process.on('SIGTERM', function() {
    gracefulShutdown('app shutdown', function () {
    process.exit(0);
    });
});

function addCounter(id){
    try{ 
        const count = new countdocs({ // Push the following key value pairs as subdocument
            ID: id,
            sequence_value: 0
        })
        const countReq = count.save({})
        if(countReq["sequence_value"] == 0){ 
            res.send("Count Started Added Successfully")
        }else{
            res.send("Adding count Failed") 
        }
        
    }catch(e){
        console.log(e)
        res.send("count Request Error")
    }
    
}