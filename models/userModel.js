const crypto = require('crypto');
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
    role: {
        type: String,
        enum: ['user','guide','lead-guide','admin'],
        default: 'user'
    },
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

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


userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000; // subtract 1000 milliseconds to ensure the password changed at is before the JWT issued at time
    next();
});


userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {

        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);

        // false means NOT changed 
        return JWTTimestamp < changedTimestamp; 
    }
    return false;
};


userSchema.methods.createPasswordResetToken = function() {
    const resetToken  = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken);


    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken; // this is the unencrypted token
}





const User = mongoose.model('User',userSchema);

module.exports = User;