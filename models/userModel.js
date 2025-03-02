const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please tell us your name']
    },
    email: {
        type: String,
        require: [true,'Please provide your email'],
        unique: true,
        lowarcase: true,
        validate: [validator.isEmail,'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true,'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // this only work on CREATE AND SAVE 
            validator: function(el) {
                return el===this.password;
            },
            message: 'Password are not the same!'
        }
    },

});
// using the pre-save middleware

userSchema.pre('save',async function(next) {
    // only run this function if password is acutally modified 
    if(!this.isModified('password')) return next();

    // using bcrypt
    this.password = await bcrypt.hash(this.password, 12);
    // this will delete the password confirm fields
    this.passwordConfirm = undefined;
    next();

});


userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
}



const User = mongoose.model('User',userSchema);

module.exports = User;