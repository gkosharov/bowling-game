/**
 * Created by g.kosharov on 28.8.2016
 */

import Express from 'express';
import monitorio from 'monitor.io'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import logger from 'morgan'
import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import httpProxy from 'http-proxy'
import config from '../../webpack.config'
import mongoConfig from './config/mongo'
import restConfig from './config/rest'
import websocketConfig from './config/websocket'
import passport from 'passport'
import SocketIo from 'socket.io'
import historyApiFallbackMiddleware from 'express-history-api-fallback'
import Game from './models/game'
import authRouter from './routes/auth'
import gameRouter from './routes/game'
import mongoSeed from './mongoSeed'
import User from './models/user'
import isArray from 'lodash/lang/isArray'
import includes from 'lodash/collection/includes'
import find from 'lodash/collection/find'
import findIndex from 'lodash/array/findIndex'
import forEach from 'lodash/collection/forEach'
import every from 'lodash/collection/every'

const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`NODE_ENV: ${NODE_ENV}`);

const webPackServerPort = process.env.PORT || 3000;
const expressPort = restConfig[NODE_ENV].port;

var proxy = httpProxy.createProxyServer();

var MongoStore = connectMongo(session);
var pathToStatic = '/public';

if (NODE_ENV == 'production') {
    pathToStatic = __dirname + '/../../public';
}

// Initialize the Express App
const app = Express()
    .use(cors({
        "origin": true,
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "credentials": true
    }))
    .use(session({
        key: "SessionId",
        secret: "SECRET",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 6000000,
            secure: false,
            httpOnly: false
        },
        store: new MongoStore({
            autoRemove: 'native',
            mongooseConnection: mongoose.connection
        })
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use(logger('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: false}))
    .use(cookieParser())
    .use(Express.static(pathToStatic))
    .use('/api', authRouter)
    .use('/api', gameRouter)
    .use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    })
    .use('/socket.io/*', function (req, res) {
        console.log("proxy to ws hit");
        proxy.web(req, res, {target: `http://0.0.0.0:${websocketConfig[NODE_ENV].port}/ws`});
    })
    .use(historyApiFallbackMiddleware(
        'index.html', {root: path.resolve(__dirname, "..", "public")}
    ))
    .enable('trust proxy')
    .listen(expressPort, restConfig[NODE_ENV].hostname, (error) => {
        if (!error) {
            console.log(`REST api is running on port ${expressPort}`); // eslint-disable-line
        } else {
            console.error("Rest api failed with error: " + JSON.stringify(error));
        }
    });

// MongoDB Connection
mongoose.connect(mongoConfig[NODE_ENV].mongoURL, (error) => {
    if (error) {
        console.error(`Please make sure Mongodb is installed and running on ${mongoConfig.local.mongoURL}`);
        throw error;
    }

    // feed some dummy data in DB.
    mongoSeed(User);
});

// passport config
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the.
// server when webpack is bundling
proxy.on('error', function (e) {
    console.log('Could not connect to proxy, please try again...');
});

proxy.on('proxyReq', function (proxyReq, req, res) {
    console.log('Proxy Request', proxyReq.path);
});

proxy.on('proxyReqWs', function (proxyReqWs, req, res) {
    console.log('Proxy *WS* Request', proxyReqWs.path);
});

proxy.on('open', function (proxySocket) {
    // listen for messages coming FROM the target here
    proxySocket.on('data', hybiParseAndLogMessage);
});

proxy.on('close', function (res, socket, head) {
    // view disconnected websocket connections
    console.log('Client disconnected');
});

/* setup websocket */
export const connections = [];

var io = null;

io = SocketIo(app);

if (NODE_ENV == 'development') {
    io.use(monitorio({port: 8000}));
}

function broadcastToOthers(socket, messageId, data) {
    console.log("Broadcasting...");
    connections.forEach(connectedSocket => {
        if (connectedSocket !== socket) {
            console.log(`Emitting ${messageId} for: ${connectedSocket.id}`);
            connectedSocket.emit(messageId, data);
        }
    });
}

function isComplete(game) {
    var isComplete = true;
    for (var frame of game.frames) {
        if (frame.status != 'complete') {
            isComplete = false;
        }
    }

    return isComplete;
}

function calcFrameResult(rolls) {
    var result = 0;
    for (var i = 0; i < rolls.length; i++) {
        result += rolls[i];
    }
    return result;
}
/* Websocket API */
io.on('connection', (socket) => {
    if (NODE_ENV == 'development') {
        socket.monitor('timeConnected', Date.now());
    }

    console.log("webscoket connection established!");
    connections.push(socket);

    // Globals set in join that will be available to
    // the other handlers defined on this connection
    var _id, _user;

    socket.emit('start', {'hello': 'there'});

    socket.on('end', function (data) {
        console.log(data);
    });

    socket.on('action', (message) => {
        console.log("Action message received!");
        console.log("Message: " + JSON.stringify(message));

        const gameId = message && message.payload ? message.payload.id : null;
        const _user = message && message.payload && message.payload.user ? message.payload.user : message.payload.username;
        Game.findOne({id: gameId}, (err, game) => {
            if (!err && game && game.status != 'finished') {

                // Remember this for later
                _id = game.id;

                if (message.type == "ws/join") {
                    socket.join(_id);

                    broadcastToOthers(socket, 'joined', {id: _id, user: _user});

                    //socket.emit('joined', {id: _id, user: _user});
                    if (includes(game.players, _user)) {
                        io.sockets.in(_id).emit('error', 'You already joined this game!');
                    } else {
                        game.players.push(_user);
                        game.save(function (err, game) {
                            if (!err) {
                                console.log("Ready event about to emit on socket " + socket.id);
                                //io.sockets.in(_id).emit('ready', game);
                                socket.emit('ready', game);
                            } else {
                                console.log("Error event about to emit...");
                                io.sockets.in(_id).emit('error', err);
                            }
                        });
                    }
                }

                if (message.type == "ws/roll") {
                    console.log(`Player ${_user} rolls: [${message.payload.knockedPins}] on frame ${message.payload.frameId}, current score: ${message.payload.result}`);
                    var frames = game.frames && isArray(game.frames) ? game.frames : [];
                    console.log("Rolls before push: " + JSON.stringify(frames));
                    var currentPlayerFrameIndex = null;
                    var currentPlayerFrame = find(game.frames, (f, idx)=> {
                        currentPlayerFrameIndex = idx;
                        return f.playerId == _user && f.id == game.currentFrame;
                    });
                    console.log("Current player frame: " + JSON.stringify(currentPlayerFrame) + " , " + currentPlayerFrameIndex);
                    var toPush = {};
                    if (currentPlayerFrame) {
                        console.log(`Updating the rolls of current frame ${currentPlayerFrame.id}...`);
                        if (currentPlayerFrame.rolls.length < 2) {
                            currentPlayerFrame.rolls.push(message.payload.knockedPins);
                            currentPlayerFrame.result = calcFrameResult(currentPlayerFrame.rolls)
                        }
                        if(currentPlayerFrame.rolls.length == 2) {
                            currentPlayerFrame.status = "completed";
                        }

                        if(currentPlayerFrameIndex) {
                            frames[currentPlayerFrameIndex] = currentPlayerFrame;
                            console.log("frames after frames update: " + JSON.stringify(frames));
                        }
                    } else {
                        console.log(`Adding new frame to frames...`);
                        toPush = {
                            playerId: _user,
                            gameId: game.id,
                            rolls: [message.payload.knockedPins],
                            id: message.payload.frameId,
                            status: "pending",
                            result: calcFrameResult([message.payload.knockedPins])
                        };
                        currentPlayerFrame = toPush;
                        console.log("To push: " + JSON.stringify(toPush));
                        frames.push(toPush);
                    }

                    console.log("Frames so far: " + JSON.stringify(frames));

                    game.frames = frames;
                    game.markModified("frames");
                    var playersCount = game.players.length;
                    var currentFrames = [];
                    forEach(game.frames, (frame)=> {
                        if (frame.id == game.currentFrame) {
                            currentFrames.push(frame);
                        }
                    });
                    if (currentFrames.length == playersCount && every(currentFrames, {status: "completed"})) {
                        game.currentFrame += 1;
                    }
                    let playerIndex = findIndex(game.players, (p)=> {
                        return p == _user;
                    });
                    if (currentPlayerFrame && currentPlayerFrame.rolls.length > 1) {
                        if(playerIndex + 1 >= game.players.length){
                            game.currentPlayer = game.players[0];
                        }else {
                            game.currentPlayer = game.players[playerIndex + 1];
                        }
                    }

                    console.log("Game rolls which are going to be persisted: " + JSON.stringify(game.frames));
                    if (isComplete(game)) {
                        game.status = 'finished';
                        game.winner = _user;
                    } else {
                        game.status = 'in_progress';
                    }
                    console.log("Game before save on-roll: " + JSON.stringify(game));
                    game.save(function (err, data) {
                        if (!err) {
                            console.log("About to broadcast the roll... with game state = " + JSON.stringify(data));
                            if (game.status == 'finished') {
                                io.sockets.in(_id).emit('finish', data);
                                broadcastToOthers(socket, 'finish', data);
                            } else {
                                broadcastToOthers(socket, 'roll', message.payload);
                            }
                        } else {
                            console.log("Error while saving game..." + JSON.stringify(err));
                            broadcastToOthers(socket, 'error', err);
                            io.sockets.in(_id).emit('error', err);
                        }
                    });
                }

                if (message.type == "ws/start") {
                    console.log("Startng game...");

                    game.status = 'in_progress';

                    game.save(function (err, game) {
                        if (!err) {
                            broadcastToOthers(socket, 'start', game);
                        } else {
                            broadcastToOthers(socket, 'error', game);
                        }
                    });
                }
            }
        });
    });

    socket.on('disconnect', () => {
        const index = connections.indexOf(socket);
        connections.splice(index, 1);
    })
});

// proxy the socket.io WS requests
proxy.on('upgrade', function (req, socket, head) {
    console.log('SOCKET CONNECTION UPGRADING');
    proxy.ws(req, socket, head);
});


if (process.env.NODE_ENV != 'production') {

    /* setup static content */
    var webPackServer = new WebpackDevServer(webpack(config), {
        publicPath: '/public/',
        hot: true,
        historyApiFallback: {
            index: '/public/index.html'
        },
        stats: {
            colors: true
        }
    });

    webPackServer.listen(webPackServerPort, restConfig[NODE_ENV].hostname || '0.0.0.0', function (err) {
        if (err) {
            console.log("Webpack server failed with " + JSON.stringify(err));
        }

        console.log(`Webpack dev server listening at ${restConfig[NODE_ENV].hostname}:${webPackServerPort}`);
    });
}

export default app;
