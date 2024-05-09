const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected"))
  .catch((err, res) => console.log("Error" + err))
// create user 
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
})

const User = mongoose.model('User', userSchema)

const exerciseSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true},
  date: { type: Date, default: Date.now },
})

const Exercise = mongoose.model('Exercise', exerciseSchema)

app.post("/api/users", (req, res) => {
  const userSave = new User({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username
  })
  userSave.save()
  .then((user) => {
    res.status(201).json({
      
        username: userSave.username,
        _id:userSave._id
      
    })
  }).catch((error) => {
    res.json({ "error": "Error trying to create a user" })
  })
})

app.get("/api/users", (req, res) => {
  User.find()
    .then((users) => {
      return [
        users.username,
        users._id
      ]
    })
    .catch((errer) => {
      res.json({ "error": "Error while fetching users" })
    })
})

app.post("/api/users/:_id/exercises", (req, res) => {

    User.findById(req.params._id)
     .then((user) => {
      const exerciseSave = new Exercise({
        _id: new mongoose.Types.ObjectId(), 
        user_id: req.params._id, 
        description: req.body.description, 
        duration: req.body.duration, 
        date: req.body.date 
      })
      exerciseSave.save()
         res.status(201).json({
        username:user.username,
        description: exerciseSave.description,
        duration: exerciseSave.duration,
        date: exerciseSave.date,
        _id:exerciseSave._id
      
    })
    })
    .catch((error) => {
      error: "Error while creating an exercise"
    })
    
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
