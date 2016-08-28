/**
 * Created by g.kosharov on 28.8.2016
 */
export default {
    production: {
        mongoURL: process.env.MONGODB_URI || 'mongodb://heroku_l3xxj2q2:6fr3ujd9n8m5197q5evk54oe8m@ds023325.mlab.com:23325/heroku_l3xxj2q2'
    },
    development: {
        mongoURL: 'mongodb://localhost:27017/bowling-game'
    }
};
