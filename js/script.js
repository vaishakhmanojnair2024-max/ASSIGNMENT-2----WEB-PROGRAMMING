console.log("JS LOADED");

/* AUTH NAVBAR */
function checkAuth(){
const user = localStorage.getItem("user");
const link = document.getElementById("authLink");
if(!link) return;

if(user){
link.innerText = "Logout";
link.onclick = logout;
}else{
link.innerText = "Login";
link.href = "login.html";
}
}
checkAuth();

/* AUTH */
function logout(){
localStorage.removeItem("user");
alert("Logged out");
window.location = "index.html";
}

async function signup(){
const username = document.getElementById("signupUser").value;
const password = document.getElementById("signupPass").value;

const res = await fetch("http://localhost:5000/signup",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username,password})
});

const data = await res.json();
alert(data.message);

if(data.message==="Signup successful"){
window.location="login.html";
}
}

async function login(){
const username = document.getElementById("loginUser").value;
const password = document.getElementById("loginPass").value;

const res = await fetch("http://localhost:5000/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username,password})
});

const data = await res.json();
alert(data.message);

if(data.message==="Login successful"){
localStorage.setItem("user",username);
window.location="index.html";
}
}

/* QUIZ CREATION */
let quizQuestions = [];

function addQuestion(){
quizQuestions.push({
question: document.getElementById("question").value,
options:[
document.getElementById("option1").value,
document.getElementById("option2").value,
document.getElementById("option3").value,
document.getElementById("option4").value
],
correct: parseInt(document.getElementById("correct").value)
});
alert("Question added");
}

async function saveQuiz(){
const title = document.getElementById("title").value;

await fetch("http://localhost:5000/quizzes",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({title,questions:quizQuestions})
});

alert("Quiz saved");
window.location="quizList.html";
}

/* LOAD QUIZZES */
async function loadQuizzes(){
const res = await fetch("http://localhost:5000/quizzes");
const quizzes = await res.json();

const container = document.getElementById("quizList");
container.innerHTML="";

quizzes.forEach(q=>{
container.innerHTML += `
<div class="quizCard">
<h3>${q.title}</h3>
<a href="takeQuiz.html?id=${q.id}">Take Quiz</a>
<br><br>
<button onclick="deleteQuiz(${q.id})">Delete</button>
</div>`;
});
}

/* DELETE */
async function deleteQuiz(id){
await fetch(`http://localhost:5000/quizzes/${id}`,{method:"DELETE"});
alert("Deleted");
loadQuizzes();
}

/* QUIZ TAKING */
let quiz, current=0, score=0;

async function initQuiz(){
const id = new URLSearchParams(window.location.search).get("id");

const res = await fetch("http://localhost:5000/quizzes");
const quizzes = await res.json();

quiz = quizzes.find(q=>q.id==id);
showQuestion();
}

function showQuestion(){
const q = quiz.questions[current];

document.getElementById("quizTitle").innerText = quiz.title;
document.getElementById("questionText").innerText = q.question;

const optionsDiv = document.getElementById("options");
optionsDiv.innerHTML="";

q.options.forEach((opt,i)=>{
optionsDiv.innerHTML += `
<div class="option" onclick="selectOption(${i},this)">
${opt}
</div>`;
});
}

function selectOption(i,el){
const correct = quiz.questions[current].correct;
const all = document.querySelectorAll(".option");

all.forEach(o=>o.onclick=null);

if(i===correct){
el.classList.add("correct");
score++;
}else{
el.classList.add("wrong");
all[correct].classList.add("correct");
}
}

function nextQuestion(){
current++;
if(current<quiz.questions.length){
showQuestion();
}else{
window.location = "result.html?score="+score+"&total="+quiz.questions.length;
}
}

/* RESULT */
if(window.location.pathname.includes("result.html")){
const params = new URLSearchParams(window.location.search);
document.getElementById("result").innerText =
`Score: ${params.get("score")} / ${params.get("total")}`;
}