require('dotenv').config();
const express=require('express');
const ejs=require('ejs');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');

const app=express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');

mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser:true,useUnifiedTopology:true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model('User',userSchema);


app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/register',(req,res)=>{
    res.render('register');
});

app.get('/secret',(req,res)=>{
    res.render('secret');
});

app.get('/submit',(req,res)=>{
    res.render('submit');
});


app.post('/register',(req,res)=>{
    const newUser = new User({
        email:req.body.email,
        password:req.body.password
    });
    newUser.save((err)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render('login');
        }
    });
});

app.post('/login',(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;

    User.findOne({email:email},(err,foundUser)=>{
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === password){
                    res.render('secret');
                }
            }
        }
    });
});

app.listen(3000,()=>{
    console.log("server has started at port 3000");
});
