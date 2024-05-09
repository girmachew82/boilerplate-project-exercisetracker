const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// create user 
const usernames = []

app.post("/api/users", (req, res)=>{
  const username = req.body.usernames
  const foundIndex  = usernames.indexOf[username]
  if(foundIndex < 0){
    usernames.push(username)
  }
  res.json(req.body.username)
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
