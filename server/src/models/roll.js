/**
 * Created by g.kosharov on 28.8.2016
 */

import mongoose from 'mongoose'
const Schema = mongoose.Schema;

var Roll = new Schema({
    id: String,
    gameId: String,
    frameId: String,
    playerId: String,
    knockedPins: Number, //[0..10]
    user: { type: Schema.ObjectId, ref: 'User' },
    time: String
});

export default mongoose.model('Roll', Roll);