/**
 * Created by g.kosharov on 28.8.2016
 */

import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    fullName: String
});

UserSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', UserSchema);