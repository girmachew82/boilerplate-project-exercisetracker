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
  const savedUsername = User.create({username})
  if(savedUsername){
    res.json(req.body.username)
  }else{
    res.json({
      message:"Something want wrong"
    })
  }
  
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
