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
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now },
})

const Exercise = mongoose.model('Exercise', exerciseSchema)

app.post("/api/users", async (req, res) => {
  const uname = req.body.username
  const check = await User.find({ username: uname }).exec()
  if (check.length != 0) {
    res.json({
          message: "User already exist",
    })
  } else {
    const userSave = new User({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username
    })
    userSave.save()
      .then((user) => {
        res.status(201).json({
          username: user.username,
          _id: user._id
        })
      }).catch((error) => {
        res.json({ "error": "Error trying to create a user" })
      })
  }
})

app.get("/api/users", async(req, res) => {
 
    
try{
  const fetchUsers = await User.find()
  .select("username _id")
  .exec()
  res.json({
       users : fetchUsers.map(user =>{
      return{
      username: user.username,
      _id: user._id
      }
    })
  })

}catch(errr){
  res.json({
    message:"Something want wrong while fetching users"
  })
}
    
})

app.post("/api/users/:_id/exercises", (req, res) => {
  let strDate = new Date(req.body.date)
  if (strDate !='Invalid Date')
    var dateInput = req.body.date
  else
  dateInput = Date.now()
  User.findById(req.params._id)
    .then((user) => {
      const exerciseSave = new Exercise({
        _id: new mongoose.Types.ObjectId(),
        user_id: req.params._id,
        description: req.body.description,
        duration: req.body.duration,
        date: dateInput
      })
      exerciseSave.save()
      res.status(201).json({
        username: user.username,
        description: exerciseSave.description,
        duration: exerciseSave.duration,
        date: exerciseSave.date.toUTCString(),
        _id: exerciseSave._id

      })
    })
    .catch((error) => {
      error: "Error while creating an exercise"
    })

})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
