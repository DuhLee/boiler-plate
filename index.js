const express = require('express')
const app = express()
const port = 3000

const config = require('./config/key');

const { User } = require('./models/User');
const bodyParser = require('body-parser');

// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// application/json
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected. . . .'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('node.js sever start')
})

app.post('/register', async (req, res) => {

    // 회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 정보를 DB에 저장한다.

    const user = new User(req.body);

    const result = await user
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})