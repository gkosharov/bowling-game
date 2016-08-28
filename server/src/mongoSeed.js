/**
 * Created by g.kosharov on 28.8.2016
 */

import forEach from 'lodash/collection/forEach'
import initialUsers from '../tests/mocks/jsons/users.json'

export default function (User) {
    forEach(initialUsers, (user)=> {
        User.register(new User(user), user.password, function (err) {
            if (err) {
                console.log('error while user register!', err);
            } else {

                console.log(`user ${user.username} registered!`);
            }
        });
    });
}