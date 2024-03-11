const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 2011;

app.use(express.json()); // Middleware : telling your Express application to use this middleware for all incoming requests.



const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jswt_secret_key = "0192837465qpwoeirutyalskdjfhcnzmcbxg)(!^@&#*$^%!()";


const uri = "mongodb+srv://unknown9588:unknown9588@apicluster.ak6rthe.mongodb.net/api-data?retryWrites=true&w=majority&appName=APICluster";
// const uri = "mongodb://localhost:27017/";


mongoose.connect(uri)
.then(() => console.log("Connected..."))
.catch((e) => console.log(e));


require('./formSchema');
const user = mongoose.model('form-data');

require('./cardSchema');
const newcard = mongoose.model('card-data');


const cors = require("cors");
app.use(cors());




// Routes
app.post('/register', async (req, res) => {

    const {firstname, lastname, age, city, email, password} = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);

    try{

        // Existing Users validation
        const oldUser = await user.findOne({ email });
        if(oldUser){
            return res.json({error: "User Already Exists!"});
        }

        // Creating a user
        await user.create({
            firstname,
            lastname,
            age,
            city,
            email, 
            password: encryptedPassword,
        })
        .then(()=>{
            res.json("User created successfully!");
        })
    }
    catch(e){
        res.json("Registration Error");
    }
})




app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try{

        //  Check if user exists
        const User = await user.findOne({ email });

        if (!User) {
            return res.status(401).json({ message: 'User does not exists' });
        }

        // if((User.email === email) && (User.password === password)){
        //     res.json("Login Success");
        // }

        if(await bcrypt.compare(password, User.password)){

            const exp = {expiresIn: '1h'};
            const token = jwt.sign({}, jswt_secret_key, exp);

    
            if(res.status(201)){
                return res.send({success: true, data: token});
            }
            else{
                return res.send({error: "error"});
            }
        }

        res.json({status: "error", error: "Invalid Password"});
    }
    catch(e){
        res.json("Login Error");
    }
})




app.post('/content-card', async (req, res) => {

    const { title, content } = req.body;

    try{

        // Creating a new content card
        await newcard.create({
            title,
            content,
        })
        .then(()=>{
            res.json("Content Card created successfully");
            // res.send(content);
        })
    }
    catch(e){
        res.json("Content Card Error");
    }
})



app.get('/dbdata', async (req, res) => {
    try {
      // Fetch data from MongoDB Atlas
      const response = await newcard.find()
      console.log(response)
      res.json(response);
    //   .then((response) => res.send(response))
    } 
    catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });




app.post('/deletecard', async (req, res) => {

    const {card_id} = req.body;

    try{
        const del = await newcard.deleteOne({ card_id })
        res.json({ status: "ok", data: del });
    }
    catch(error){
        console.log(error);
    }
})



app.listen(port, () => {
    console.log(`Listening at PORT ${port}`);
})