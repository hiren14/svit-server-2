const express = require("express")
const bp = require("body-parser")
const mysql = require('mysql')

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '9999'
})

con.connect(err => {
  if (err) throw err

  console.log('connected')
})

con.query('USE svit;')

// const req = require("express/lib/request")
// const res = require("express/lib/response")
const app = express()

app.use(bp.json())

const users = [{
  username:'keval',
  password:'999'
}]

// connectToMongo()

/* GET login page. */
app.post("/login", (req, res, next) => {
  const userData = req.body
  var query = ''
console.log(userData.role)


  if (userData.role === 'STUDENT'){
    query = "SELECT * from student WHERE username='" + userData.username +"' AND password='" + userData.password +"';"
  }
  else{
    query = "SELECT * from teacher WHERE username='" + userData.username +"' AND password='" + userData.password +"';"
  }

  con.query(query,(err,response,field) => {
    if (err) res.json('err')
    res.json(response)
  }) 
  // res.send("../pages/Login.js", { title: "Login" })
})

/* register routes. */
app.post("/register", (req, res) => {
  const { username, email, password, role} = req.body
  var query = ''

  if (role === 'STUDENT'){
    query = "INSERT INTO student (username,email,password) values ('"+username+"','"+email+"','"+password+"');"  
  }
  else{
    query = "INSERT INTO teacher (username,email,password) values ('"+username+"','"+email+"','"+password+"');"
  }

  con.query(query,(err,response,field) => {
    if (err) throw err;
    console.log(response)
  })
  res.json('0')
  
  // const { username, email, password } = req.body.userData;
  
  // users.push({username:username,email:email,password:password})

  // console.log('registered')
  // res.json('0')
});

app.post("/createroom",(req,res) => {
  const { room_name, room_code, username } = req.body

  var query1 = "SELECT id from teacher where username='"+username+"';"
  var user_id = ''
  con.query(query1,(err,response,field) => {
    if (err) res.json(err)
    user_id = response[0].id
    var query2 = "INSERT INTO room_teacher (teacher_id,room_name,room_code) values ('"+user_id+"','"+room_name+"','"+room_code+"');"
    con.query(query2,(err,response,field) => {
      if (err) res.json(err)
      res.json(response)
    })
  })
  
})

app.post('/roomlist',(req,res) => {
  const {username} = req.body

  var query1 = "SELECT id from teacher where username='"+username+"';"
  var user_id = ''
  con.query(query1,(err,response,field) => {
    if (err) res.json(err)
    user_id = response[0].id
    var query2 = "SELECT * FROM room_teacher WHERE teacher_id="+user_id+";"
    con.query(query2,(err,response2) => {
      if(err) res.json(err)
      console.log(response2)
      res.json(response2)
    })
  })  
})

app.post('/joinroom',(req,res) => {
  const {username,room_code,h_index} = req.body
  
  var query1 = "SELECT id from student WHERE username='"+username+"';"
  var user_id = ''
  
  con.query(query1, (err,response) => {
    if (err) res.json(err)
    user_id = response[0].id

    var query2 = "INSERT INTO room_student (student_id,room_code,h_index) values ('" + user_id + "','" + room_code + "','" + h_index+"');"
    con.query(query2, (err,response2) => {
      if (err) res.json(err)
      res.json(response2)
    })
  })
})

app.listen(3005)
