/**
 * Created by g.kosharov on 28.8.2016
 */

import mongoose from 'mongoose'
//import forEach from 'lodash/collection/forEach'
const Schema = mongoose.Schema;

var Game = new Schema({
    id: String,
    players: [String],
    frames: [Schema.Types.Mixed],
    currentFrame: Number,
    startingPlayer: String,
    status: String,
    winner: String
});
/*
Game.methods.isComplete = function (cb) {
    return this.model('Game').find({ id: this.id }, (gameData)=>{
        var isComplete = true;
        forEach(gameData.frames, (frame) => {
            if(frame.status != 'complete'){
                isComplete = false;
            }
        })
    });
};*/

export default mongoose.model('Game', Game);