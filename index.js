const express = require('express')
const app = express()
const port = 3000

const config = require('./config/key');

const { User } = require('./models/User');
const { auth } = require('./middleware/auth');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// application/json
app.use(express.json());

// cookie-parser
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected. . . .'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('node.js sever start')
})

app.post('/api/user/register', async (req, res) => {

    // 회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 정보를 DB에 저장한다.

    const user = new User(req.body);

    const regResult = await user
    .save()
    .then(() => {
        res.status(200).json({
            success: true
        })
    })
    .catch((err) => {
        res.json({ success: false, err})
    });
})

app.post('/api/user/login', async (req,res) => {

    // 요청된 이메일을 데이터베이스에서 찾기
    User.findOne({ email: req.body.email})
    .then((user) => {
        if (!user) return res.json({
                                    loginSuccess: false,
                                    message: "등록된 이메일이 없습니다."     
        })

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({
                                            loginSuccess: false,
                                            message: "비밀번호가 일치하지 않습니다."
            })

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err)

                res.cookie("x_auth", user.token)
                                .status(200)
                                .json({
                                    loginSuccess: true,
                                    userId: user._id
                                })
            })
        })
    })
})

app.get('/api/user/auth', auth, async (req, res) => {

    // Authentication true
    res.status(200).json({
        _id: req.user._id,
        isAdimn: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/user/logout', auth, async (req, res) => {

    User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .exec()
    .then(() => res.status(200).send({ success: true }))
    .catch(err => res.json({ success: false, err }))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})