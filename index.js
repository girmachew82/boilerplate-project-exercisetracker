const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log("Connected"))
.catch((err, res)=>console.log("Error"+err))
// create user 
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{type:String, required: true},
})

const User = mongoose.model('User',userSchema)

const exerciseSchema = new Schema({
  user_id:{type:String, required: true},
  description:{type:String, required: true},
  duration: {type:Number, required:true,"message":"Duration is required"},
  date: {type: Date,default: Date.now},
})

const Exercise = mongoose.model('Exercise',exerciseSchema)

app.post("/api/users", (req, res)=>{
  const username = req.body.username
User.create({username}).then((user)=>{
  res.json(user)
}).catch((error)=>{
  res.json({"error":"Error trying to create a user"})
})
})

app.get("/api/users",(req, res)=>{
  User.find()
  .then((users)=>{
    return [
      users.username,
      users._id
    ]
  })
  .catch((errer)=>{
    res.json({"error":"Error while fetching users"})
  })
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
