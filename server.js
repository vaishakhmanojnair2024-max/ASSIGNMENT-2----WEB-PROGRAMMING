const USERS_FILE = "users.json";
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "quizzes.json";

/* Get all quizzes */
app.get("/quizzes", (req,res)=>{
    const quizzes = JSON.parse(fs.readFileSync(FILE));
    res.json(quizzes);
});

/* Get single quiz */
app.get("/quizzes/:id",(req,res)=>{
    const quizzes = JSON.parse(fs.readFileSync(FILE));
    const quiz = quizzes.find(q => q.id == req.params.id);
    res.json(quiz);
});

/* Create quiz */
app.post("/quizzes",(req,res)=>{

    const quizzes = JSON.parse(fs.readFileSync(FILE));

    const existingIndex = quizzes.findIndex(
        q => q.title.toLowerCase() === req.body.title.toLowerCase()
    );

    if(existingIndex !== -1){

        quizzes[existingIndex].questions = req.body.questions;

    } else {

        quizzes.push({
            id: Date.now(),
            title: req.body.title,
            questions: req.body.questions
        });

    }

    fs.writeFileSync(FILE, JSON.stringify(quizzes,null,2));

    res.json({message:"Quiz saved"});
});

/* Submit quiz */
app.post("/submit/:id",(req,res)=>{

    const quizzes = JSON.parse(fs.readFileSync(FILE));
    const quiz = quizzes.find(q => q.id == req.params.id);

    const answers = req.body.answers;

    let score = 0;

    quiz.questions.forEach((q,i)=>{
        if(q.answer === answers[i]){
            score++;
        }
    });

    res.json({
        score: score,
        total: quiz.questions.length
    });

});

/* Delete quiz */

app.delete("/quizzes/:id",(req,res)=>{

    const quizzes = JSON.parse(fs.readFileSync(FILE));

    const updatedQuizzes = quizzes.filter(
        q => q.id != req.params.id
    );

    fs.writeFileSync(FILE, JSON.stringify(updatedQuizzes,null,2));

    res.json({message:"Quiz deleted"});
});

/* SIGNUP */

app.post("/signup",(req,res)=>{

const users = JSON.parse(fs.readFileSync(USERS_FILE));

const {username,password} = req.body;

const existingUser = users.find(u => u.username === username);

if(existingUser){
return res.json({message:"User already exists"});
}

users.push({
id: Date.now(),
username,
password
});

fs.writeFileSync(USERS_FILE,JSON.stringify(users,null,2));

res.json({message:"Signup successful"});

});

/* LOGIN */

app.post("/login",(req,res)=>{

const users = JSON.parse(fs.readFileSync(USERS_FILE));

const {username,password} = req.body;

const user = users.find(
u => u.username === username && u.password === password
);

if(!user){
return res.json({message:"Invalid credentials"});
}

res.json({
message:"Login successful",
username:user.username
});

});

app.listen(5000,()=>{
    console.log("Server running on port 5000");
});