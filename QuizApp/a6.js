const GEOGRAPHY = "GeographyQuiz.json";
const MATH = "MathQuiz.json";
let QUIZFILE;
let quiz; // initialized by AJAX call; global so that all functions can access
let userID; //variable for username
let jsonStore, totalScore, totalQuestions, recordList, collection, records;

window.onload = function () {
  
    // assign click handler for Start button.
  document
  .querySelector("#takeQuizBtn")
  .addEventListener("click", chooseQuiz);

  // assign click handler for Search button.
  document
    .querySelector("#searchButton")
    .addEventListener("click", searchResults);

   // assign click handler for Start button.
   document
   .querySelector("#startButton")
   .addEventListener("click", startQuiz);

   // assign click handler for Submit button.
  document
  .querySelector("#submitButton")
  .addEventListener("click", submitAnswers);
  
  // assign click handler for Start button.
  document
  .querySelector("#viewResultsBtn")
  .addEventListener("click", viewResults);
  
  // assign click handler for home button.
  document
  .querySelector("#resetButton")
  .addEventListener("click", reload);

  

  pageLayoutLoad();
};

//function for fresh page load
function pageLayoutLoad() {
  let devBtnDiv = document.querySelector("#devBtnDiv");
  let questionDiv = document.querySelector("#theQuestions");
  let submitBtn = document.querySelector("#submitButton");
  let resultsDiv = document.querySelector("#results");
  let chooseDiv = document.querySelector("#chooseDiv");
  let reviewDiv = document.querySelector("#reviewDiv");
   
  

  devBtnDiv.classList.add("d-none");
  questionDiv.classList.add("d-none");
  submitBtn.classList.add("d-none");
  resultsDiv.classList.add("d-none");
  chooseDiv.classList.add("d-none");
  reviewDiv.classList.add("d-none");
  
}

//function for start quiz button
function chooseQuiz() {
    let landingDiv = document.querySelector("#landing-page");
    landingDiv.classList.add("d-none");
    landingDiv.classList.remove("d-flex");

    let chooseDiv = document.querySelector("#chooseDiv");
    chooseDiv.classList.remove("d-none");

    let devBtnDiv = document.querySelector("#devBtnDiv");
    devBtnDiv.classList.remove("d-none");

    //get name from form
    userID = document.querySelector("#startName").value;

    let homeBtn = document.querySelector("#resetButton");
    homeBtn.classList.remove("d-none");

}

//function for view Results button
function viewResults() {
    let landingDiv = document.querySelector("#landing-page");
    landingDiv.classList.add("d-none");
    landingDiv.classList.remove("d-flex");

    let reviewDiv = document.querySelector("#reviewDiv");
    reviewDiv.classList.remove("d-none");

    let homeBtn = document.querySelector("#resetButton");
    homeBtn.classList.remove("d-none");
}

//function for search button
function searchResults() {

  //get name from form
  userID = document.querySelector("#searchName").value;

  if (userID != "") {
      //fetch collection
     callCollection(userID);
         
  }

  buildReview();
}

//function for start button
function startQuiz() {
    userID = document.querySelector("#startName").value;
    if (userID != "") {
    document.querySelector("#theQuestions").classList.remove("d-none");
    document.querySelector("#submitButton").classList.remove("d-none");

    let select = document.getElementById("quizSelect") ;
    let option = select.value;
            
        if (option == 1){
            QUIZFILE = GEOGRAPHY;
        } else if(option == 2){
            QUIZFILE = MATH;
        }
    
    buildQuiz();
    createCollection(userID);
    } else {
        window.alert("Must enter your Name");
    }
}
//function to get collection
function callCollection(userID) {
  let url = "https://assignment0.com/jsonstore/webservice/Alex/collections/" + userID + "/records";
  let method = "GET";
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 ) { 
      let fileContents = xhr.responseText;
      collection = JSON.parse(fileContents);
    };
  };

  xhr.open(method, url, false);
  xhr.send();
}

//function to POST record to collection
function postRecord(inResult, inCollection) {
  let url =
    'https://assignment0.com/jsonstore/webservice/Alex/collections/'+ inCollection +'/records';
  let method = "POST";
  let dataToStore = '{' + inResult + '}';
  let jsonToStore = JSON.stringify(dataToStore);
  let payload = JSON.stringify({ jsonString: jsonToStore });

  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.responseText);
    }
  };

  xhr.open(method, url, true);
  xhr.send(payload);
}

//function to build quiz
function buildMain() {
  let elem = document.querySelector("#theQuestions");
  let html = "<h1 class='mb-3'>" + quiz.title + "</h1>";
  let questions = quiz.questions;

  html += '<ul class="nav nav-pills mb-3">';

  for (let i = 0; i < questions.length; i++) {
    html += '<li class="nav-item">';
    html += i > 0 ? '<a class="nav-link"' : '<a class="nav-link active"';
    html += ' data-toggle="tab" role="tab" href="#q';
    html += "" + (i + 1) + '">Question ' + (i + 1) + "</a></li>";
  }
  html += "</ul>";

  html += '<div class="tab-content">';

  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    html += '<div id="q' + (i + 1) + '"';
    html +=
      i > 0 ? ' class="tab-pane fade">' : ' class="tab-pane fade show active">';
    html += "<div class='card mb-3'>";
    html += "<h5 class='card-header'>Question " + (i + 1) + "</h5>";
    html += "<div class='card-body'>";
    html += "<p>" + question.questionText + "</p>";
    let choices = question.choices;
    for (let j = 0; j < choices.length; j++) {
      let choice = choices[j];
      html +=
        "<p class='ml-5'><input type='radio' value='" +
        choice +
        "' name='question" +
        i +
        "'> " +
        choice +
        "</p>";
    }
    html += "</div></div></div>";
  }
  html += "</div>";
  elem.innerHTML = html;
}

//function for submit button
function submitAnswers() {
  let answerInputElements = document.querySelectorAll(
    "input[type='radio']:checked"
  );
  let questions = quiz.questions;

  if (answerInputElements.length !== questions.length) {
    alert("You must answer all questions!");
    return;
  }

  let results = [];
  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    let answerInputElement = answerInputElements[i];
    let answer = answerInputElement.value;
    let obj = {
      question: question,
      userAnswer: answer,
      correctAnswer: question.choices[question.answer],
    };
    results.push(obj);
    buildResults(results);
  }
  console.log(buildJson(results));
  postRecord(jsonStore, userID);

  
  console.log(jsonStore);
  
  console.log(results);
  let resultsDiv = document.querySelector("#results");
      resultsDiv.classList.remove("d-none");
}

//function to build results 
function buildResults(results) {
  let resultsDiv = document.querySelector("#results");
  resultsDiv.classList.remove("d-none");
  let html = "<h2>Details</h2>";
  html += "<table class='table table-bordered'>";
  html += "<tr>";
  html += "<th>Question #</th>";
  html += "<th>Question Text</th>";
  html += "<th>Correct Answer</th>";
  html += "<th>Your Answer</th>";
  html += "<th class='text-center'>Score</th>";
  html += "</tr>";
  totalScore = 0;
  for (let i = 0; i < results.length; i++) {
    let res = results[i];
    let currScore = res.correctAnswer === res.userAnswer ? 1 : 0;
    totalScore += currScore;
    let rowHtml = currScore === 1 ? "<tr>" : "<tr class='text-danger'>";
    rowHtml += "<td>Question " + (i + 1) + "</td>";
    rowHtml += "<td>" + res.question.questionText + "</td>";
    rowHtml += "<td>" + res.correctAnswer + "</td>";
    rowHtml += "<td>" + res.userAnswer + "</td>";
    rowHtml += "<td class='text-center'>" + currScore + "</td>";
    rowHtml += "</tr>";
    html += rowHtml;
  }
  html += "</table>";
  

  html =
    "<h4 class='bg-success p-3 mt-3 mb-3'>Your Score = " +
    totalScore +
    " / " +
    results.length +
    "</h4>" +
    html;

  document.querySelector("#results").innerHTML = html;
  
  totalQuestions = results.length;
}

//function to buildJson for upload
function buildJson(results) {
    jsonStore = "";
    // jsonStore += '{ '
    jsonStore += '"userID": "' + userID + '",';
    jsonStore += '"quizTitle": "' + quiz.title + '",';
    jsonStore += '"question": [';
  //loop through questions  
  for (let i = 0; i < results.length; i++) {
    let res = results[i];    
    
    jsonStore += '{"questionText": "' + res.question.questionText + '",';
    jsonStore += '"userAnswer": "' + res.userAnswer + '",';
    jsonStore += '"CorrectAnswer": "' + res.correctAnswer + '"}';
        if (i < results.length - 1)
        {
            jsonStore += ",";
        }    
  }
  jsonStore += '],"totalScore": "' + totalScore + '",';
  jsonStore += '"totalQuestions": "' + totalQuestions + '"';
//   jsonStore += " }"
}

//function to build the review card
function buildReview() {
    
    let html = "<table class='table table-bordered table-hover'>";
    html += "<tr>";
    html += "<th>Quiz</th>";
    html += "<th>Taken On</th>";
    html += "<th>Score</th>";
    html += "</tr>";

    let data = collection.data;
    for (let i = 0; i < data.length; i++) {
        let array = data[i];
        let nextRow = JSON.parse(array.jsonString);
        let newRow = JSON.parse(nextRow);
        console.log(newRow);
        html += '<tr class="recordBtn" id="' + [i] + '">';
        html += "<td>";
        html += newRow.quizTitle;
        html += "</td>";
        html += "<td>";
        html += array.lastUpdated;
        html += "</td>";
        html += "<td>";
        html += newRow.totalScore;
        html += "</td>";
        html += "</tr>";
    };

    html +="</table>";
  let container = document.querySelector("#resultsFound");
  container.innerHTML = html;

  let recordBtn = document.querySelectorAll(".recordBtn");
      recordBtn.forEach((btn) => {
        btn.addEventListener("click", buildRecord)})

}

//function for building the records
function buildRecord() {
  
  let rowId = event.currentTarget.id;
  let html = "<h2>Details</h2>";
  html += "<table class='table table-bordered'>";
  html += "<tr>";
  html += "<th>Question #</th>";
  html += "<th>Question Text</th>";
  html += "<th>Correct Answer</th>";
  html += "<th>Your Answer</th>";
  html += "<th class='text-center'>Score</th>";
  html += "</tr>";
  totalScore = 0;
  console.log(rowId);

  let data = collection.data;
  let array = data[rowId];
  let nextRow = JSON.parse(array.jsonString);
  let newRow = JSON.parse(nextRow);
  console.log(newRow);
  for (let i = 0; i < newRow.question.length; i++) {
    
    
    
    let currScore = newRow.question[i].CorrectAnswer === newRow.question[i].userAnswer ? 1 : 0;
    totalScore += currScore;
    let rowHtml = currScore === 1 ? "<tr>" : "<tr class='text-danger'>";

    rowHtml += "<td>Question " + (i + 1) + "</td>";
    rowHtml += "<td>" + newRow.question[i].questionText + "</td>";
    rowHtml += "<td>" + newRow.question[i].CorrectAnswer + "</td>";
    rowHtml += "<td>" + newRow.question[i].userAnswer + "</td>";
    rowHtml += "<td class='text-center'>" + currScore + "</td>";
    rowHtml += "</tr>";
    html += rowHtml;
  }
  html += "</table>";
  

  html =
    "<h4 class='bg-success p-3 mt-3 mb-3'>Your Score = " +
    totalScore +
    " / " +
    newRow.question.length +
    "</h4>" +
    html;

    document.querySelector("#results").innerHTML = html;

    let resultsDiv = document.querySelector("#results");
    resultsDiv.classList.remove("d-none");
}

//function for ajax call to build quiz
function buildQuiz() {
    // get data from file and then build the quiz.
  let url = QUIZFILE;
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        let fileContents = xhr.responseText;
        quiz = JSON.parse(fileContents);
        buildMain();
      } else {
        alert("ERROR: problem reading the quiz!");
      }
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
    
}

//function to try and create collection
function createCollection(userID) {
    try {
        let url = "https://assignment0.com/jsonstore/webservice/Alex/collections";
        let method = "POST";
        let payload = JSON.stringify({ collectionId: userID });
        console.log(payload);
            
        let xhr = new XMLHttpRequest();
            
        xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.responseText);
        }
        };
            
        xhr.open(method, url, true);
        xhr.send(payload);
    } finally {};
} 
//function for page reload
function reload() {
    location.reload(true);
};