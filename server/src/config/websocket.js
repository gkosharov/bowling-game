/**
 * Created by g.kosharov on 28.8.2016
 */
export default {
    production: {
        url: 'ws://my-bowling-game.herokuapp.com:4044',
        hostname: '0.0.0.0',
        port: process.env.PORT || 4044
    },
    development: {
        url: 'ws://localhost:4044',
        hostname: 'localhost',
        port: 4044
    }
};
