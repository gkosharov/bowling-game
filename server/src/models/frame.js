/**
 * Created by g.kosharov on 28.8.2016
 */


import mongoose from 'mongoose'
const Schema = mongoose.Schema;

var Frame = new Schema({
    id: String,
    gameId: String,
    rolls: [Number], //[5,5]
    result: Number,
    status: String, // pending, completed
    playerId: String
});

export default mongoose.model('Frame', Frame);