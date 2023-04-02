import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    id: Number,
    username: String,
    token: String,
});

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;