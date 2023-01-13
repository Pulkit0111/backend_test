const express=require("express")
const {connection}=require("./configs/db")
const {UserModel}=require("./models/User.model")
const jwt=require("jsonwebtoken")
require("dotenv").config()

const app=express()
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Home Page")
})

app.post("/register",async (req,res)=>{
    const payload=req.body
    try{
        const user=new UserModel(payload)
        await user.save()
        res.send("Registered")
    }catch(err){
        res.send("Error in registering the user")
        console.log(err)
    }
})

app.post("/login",async (req,res)=>{
    const {email,pass}=req.body
    try{
        const user=await UserModel.find({email,pass})
        const token = jwt.sign({ course: 'backend' }, process.env.key);
        if(user.length>0){
            res.send({"msg":"Login Successfull","token":token})
        } else {
            res.send("Wrong Credntials")
        }
    } catch(err){
        res.send("Something went wrong")
        console.log(err)
    }
    
})

app.get("/about", (req,res)=>{
    res.send("About API")
})

app.get("/data", (req,res)=>{
    const token=req.headers.authorization
    console.log(token)
    jwt.verify(token, process.env.key, (err,decoded)=>{
        if(err){
            res.send("Invalid token")
            console.log(err)
        } else {
            res.send("Data...")
        }
    });  
})

app.get("/cart", (req,res)=>{
    const token=req.query.token;
    jwt.verify(token, process.env.key, (err,decoded)=>{
        if(err){
            res.send("Invalid token")
            console.log(err)
        } else {
            res.send("CART PAGE")
        }
    });  
})

app.get("/contact", (req,res)=>{
    res.send("Contacts Page")
})

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("Connected to the DB")
    }catch(err){
        console.log("Trouble connecting to the DB")
        console.log(err)

    }
    console.log("running the server")
})