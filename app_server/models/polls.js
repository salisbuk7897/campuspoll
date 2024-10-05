import { Schema, model } from 'mongoose';

//subdocument
var pollsSchema = new Schema({
    datetime: {type: Date, required: true},
    id: {type: Number, required: true},
    Poll: {type: String, required: true},
    Options: {type: Array, required: true}, 
    Ends: {type: Date, required: true},
    Voters: {type: Array, required: true}
});

export const polldocs = model('PollActivity', pollsSchema);