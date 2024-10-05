import { Schema, model } from 'mongoose';

//subdocument
var countSchema = new Schema({
    ID: {type: String, required: true},
    sequence_value: {type: Number, required: true}
});

export const countdocs = model('CountActivity', countSchema);