/**
 * Created by g.kosharov on 28.8.2016
 */
export default {
    production: {
        url: 'http://my-bowling-game.herokuapp.com',
        hostname: '0.0.0.0',
        port: process.env.PORT || 3033
    },
    development: {
        url: 'http://localhost:3033',
        hostname: 'localhost',
        port: 3033
    }
};
