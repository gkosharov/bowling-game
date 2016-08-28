/**
 * Created by g.kosharov on 28.8.2016
 */

import passport from 'passport'
import User from '../models/user'

export function getUser(req, res) {
    console.log("User from request: " + JSON.stringify(req.user));
    if (req.user && req.user.username) {

        User.findOne({username: req.user.username}, (err, data)=> {
            console.log("Logged  user: " + JSON.stringify(data));
            if (!err) {

                res.json();
            }
            else {
                return res.status(500).json({"message": err})
            }
        })

    } else {
        res.status(500).json({message: "Corrupt user session!"});
    }
}

export function authenticate(req, res, next) {

    console.log("Submitted user: " + JSON.stringify(req.body));

    passport.authenticate('local', function (err, user, info) {
        console.log("user: " + JSON.stringify(user));
        console.log("info: " + JSON.stringify(info));
        console.log("err: " + JSON.stringify(err));
        if (err) {
            console.error("Authentication failure: " + err);
            return next(err);
        }
        if (!user) {
            return res.redirect('/asdf');
        }

        req.logIn(user, function (err) {
            if (err) {
                console.error("Login failure: " + err);
                return next(err);
            }
            return res.json({
                "status": "ok"
            });
        });

    })(req, res, next);
}

export function createUser(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if (err) {
            return res.json({account: user});
        }

        passport.authenticate('local')(req, res, function () {
            return res.json({redirectTo: '/'});
        });
    });
}
