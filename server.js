const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const usernameSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    }
});

const exerciseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'username',
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const Username = mongoose.model('username', usernameSchema);
const Exercise = mongoose.model('exercise', exerciseSchema);

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', async (req, res) => {
    const username = req.body.username;

    let foundUsername = await Username.findOne({username}).exec();
    if (!foundUsername) foundUsername = await Username.create({username}); 

    let _id = foundUsername.id; 

    res.json({ username, _id });
});

app.get('/api/exercise/users', async (req, res) => {
    const allUserRecords = await Username.find({}).exec();
    res.send(allUserRecords);
});

app.post('/api/exercise/add', async (req, res) => {
    let { userId, description, duration, date } = req.body;
    const dateObj = !date ? new Date() : new Date(date);
    const exerciseRecord = await Exercise.create({ userId, description, duration, date: dateObj });
    res.json({
        _id: userId,
        username: (await Username.findById(userId).lean().exec()).username,
        duration: +duration,
        date: formatDateToStr(dateObj),
        description,
    });
});

app.get('/api/exercise/log', async (req, res) => {
    let {userId, from, to, limit} = req.query
    const foundUser = await Username.findById(userId).select('-__v').lean().exec();
    let log = await Exercise.find({userId}).lean().exec();

    if (from) log = log.filter(entry => new Date(from) <= new Date(entry.date));
    if (to) log = log.filter(entry => new Date(to) >= new Date(entry.date));
    if (limit) log = log.slice(0, +limit);

    res.json({...foundUser, log, count: log.length});    
});

// Not found middleware
app.use((req, res, next) => {
    return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
    let errCode, errMessage

    if (err.errors) {
        // mongoose validation error
        errCode = 400 // bad request
        const keys = Object.keys(err.errors)
        // report the first validation error
        errMessage = err.errors[keys[0]].message
    } else {
        // generic or custom error
        errCode = err.status || 500
        errMessage = err.message || 'Internal Server Error'
    }
        res.status(errCode).type('txt')
        .send(errMessage)
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
});

function formatDateToStr(dateObj){
    const utcTime = dateObj.toUTCString();
    const day = utcTime.slice(0,3);
    const date = utcTime.slice(5,7);
    const month = utcTime.slice(8,11);
    const year = utcTime.slice(12,16);

    return `${day} ${month} ${date} ${year}`;
}