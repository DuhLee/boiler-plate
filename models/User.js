const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 50,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function(next){

    // 유저 정보
    let user = this;

    if (user.isModified('password')) {
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);
            
            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if (err) return next(err);
                
                user.password = hash;
                
                next();
            });
        });
    } else 
        next();

})

userSchema.methods.comparePassword = function (plainPassword,cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        return cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function (cb) {

    // jsonwebtoken으로 토큰 생성
    let user = this;

    let token = jwt.sign(user._id.toHexString(), 'secretToken');
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = token;
    user.save()
    .then(() => cb(null, user))
    .catch((err) => cb(err))
    
}

userSchema.statics.findByToken = function(token, cb) {
    let user = this;

    // decode Token user._id + 'secretToken' = token
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        // findOne() : mongoDB method
        // 수정 코드
        user.findOne({ 
                        "_id" : decoded, 
                        "token": token 
                    }) 
                    .exec()
                    .then( user => cb(null, user) )
                    .catch( err => cb(err) )
        
        // 기존 코드
        // user.findOne({ 
        //                 "_id" : decoded, 
        //                 "token": token 
        //             }             
        //             , (err, user) => {
        //                 if (err) return cb(err);
        //                 return cb(null, user);
        //             })
    });
}

const User = mongoose.model('User', userSchema);

module.exports = { User }