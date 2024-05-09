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


app.post("/api/users", (req, res)=>{
  const username = req.body.username
User.create({username}).then((user)=>{
  res.json(user)
}).catch((error)=>{
  res.json({"error":"Error trying to create a user"})
})
 
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
