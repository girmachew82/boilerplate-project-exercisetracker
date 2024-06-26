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

app.get("/api/users", async (req, res) => {
  try {
    const fetchUsers = await User.find()
      .select("username _id")
      .exec()
    const usersData = fetchUsers.map(user => ({
      username: user.username,
      _id: user._id
    }));
    res.json(usersData);
  } catch (errr) {
    res.status(500).json({
      message: "Something want wrong while fetching users"
    })
  }

})
app.post("/api/users/:_id/exercises", (req, res) => {
  let strDate = new Date(req.body.date)
  if (strDate != 'Invalid Date')
    var dateInput = req.body.date
  else
    dateInput = Date.now()
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const exerciseSave = new Exercise({
        _id: new mongoose.Types.ObjectId(),
        user_id: req.params._id,
        description: req.body.description,
        duration: req.body.duration,
        date: dateInput
      })
      exerciseSave.save()
        .then((exerciseSaved) => {
          res.status(201).json({
                      username: user.username, 
                      _id: user._id, 
                      description: exerciseSaved.description , 
                      duration: exerciseSaved.duration ,  
                      date: new Date(exerciseSaved.date).toDateString()
          })
        })
    })
    .catch((error) => {
      error: "Error while creating an exercise"
    })
})

app.get("/api/users/:_id/logs", (req, res) => {
  // Extract user ID from request params
  const userId = req.params._id;

  // Parse query parameters
  const fromDate = req.query.from ? new Date(req.query.from) : null;
  const toDate = req.query.to ? new Date(req.query.to) : null;
  const limit = req.query.limit ? parseInt(req.query.limit) : null;

  // Check if user exists
  User.findById(userId)
      .then(user => {
          if (!user) {
              return res.status(404).json({ message: "User not found" });
          }
          // Define query for finding exercises
          const query = { user_id: userId };
          if (fromDate) query.date = { $gte: fromDate };
          if (toDate) {
              if (!query.date) query.date = {};
              query.date.$lte = toDate;
          }
          // Find exercises based on query
          let exerciseQuery = Exercise.find(query);
          if (limit) exerciseQuery = exerciseQuery.limit(limit);

          exerciseQuery.then(exercises => {
              const exerciseLog = exercises.map(exercise => ({
                  description: exercise.description,
                  duration: exercise.duration,
                  date: exercise.date.toDateString() // Format date as a string using toDateString()
              }));
              res.json({
                  _id: user._id,
                  username: user.username,
                  log: exerciseLog,
                  count: exercises.length
              });
          }).catch(error => {
              res.status(500).json({ message: "Error while fetching exercises" });
          });
      }).catch(error => {
          res.status(500).json({ message: "Error while finding user" });
      });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
