import mongoose from 'mongoose';

import '../models/user';

const User = mongoose.model('User');

export function setUpConnection() {
    mongoose.connect('mongodb://localhost/marks_users')
}

export function findUserById(id) {
    return User.findById(id);
}

export function findUser(login) {
    return User.find({ login: login });
}

export function createUser(login, password) {
    const user = new User({
        login: login,
        password: password
    });
    return user.save();
}