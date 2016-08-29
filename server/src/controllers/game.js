/**
 * Created by g.kosharov on 28.8.2016
 */

import Game from '../models/game'
import shortid from 'shortid'

export function getGame(req, res, next) {
    console.log("getGame invoked...");
    const id = req.params.id;
    console.log(JSON.stringify(query));
    const query = {id: id};
    Game.findOne(query).exec((err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(data);
    });
}

export function getGames(req, res, next) {
    console.log("getGames invoked...");

    Game.find({}).exec((err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(data);
    });
}

export function createGame(req, res, next) {
    console.log("createGame invoked...");
    console.log("Payload: " + JSON.stringify(req.body));
    console.log("User: " + JSON.stringify(req.user));

    var gameParams = req.body;

    var gameId = shortid.generate();

    Game.create({
            id: gameId,
            status: 'waiting',
            players: [
                req.user.username
            ],
            currentFrame: 1,
            currentPlayer: req.user.username,
            startingPlayer: req.user.username,
            frames: []
        },
        function (err, game) {
            if (!err) {
                var data = game.toJSON();
                res.json(data);
            } else {
                res.status(500).json({"message": "Failed to create a game!"});
            }
        });

}

export function updateGame(req, res) {
    console.log("updateGame invoked...");
    console.log("Payload: " + JSON.stringify(req.body));
    const id = req.params.id;

    var query = {"class": id};

    Game.update(query, req.body).exec((err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({status: "ok"});
    });
}

export function deleteGame(req, res, next) {
    console.log("deleteGame invoked...");

    const id = req.params.id;

    var query = {"class": id};

    Game.remove(query).exec((err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({status: "ok"});
    });
}