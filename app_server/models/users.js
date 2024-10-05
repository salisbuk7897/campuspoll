import { Schema, model } from 'mongoose';

var userSchema = new Schema({
    datetime: {type: Date, required: true},
    Fname: {type: String, required: true},
    Lname: {type: String, required: true},
    Mname: {type: String},
    Email: {type: String, required: true},
    Regnumber: {type: String, required: true},
    Username: {type: String, required: true},
    Password : {type: String, required: true},
    User_ID: {type: String, required: true}
});

export const userdocs = model('UserActivity', userSchema);