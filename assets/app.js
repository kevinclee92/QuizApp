var questionArea = $("#txtQuestion");
var answerArea = $("#divAnswer")
var quizApp = {

  questions: null,
  currentQuestion: 0,
  correct: 0,
  incorrect: 0,

  shuffleQuestions: function() {
    this.questions.sort(() => Math.random() - 0.5)
  },

  loadQuestion: function() {
    answerArea.empty();
    questionArea.text(this.questions[this.currentQuestion].question)
    this.questions[this.currentQuestion].choices.forEach((choice) => answerArea.append("<button class='card-text answer' data-name='" + choice + "'>" + choice + "</button>"))
  },

  nextQuestion: function() {
    this.currentQuestion++;
    this.loadQuestion();
  },

  gameOver: function() {
    answerArea.append("<h4>Total Correct Answers: <span class='green-text'>" + this.correct + "</span></h4>");
    answerArea.append("<h4>Total Incorrect Answers: <span class='red-text'>" + this.incorrect + "</span></h4></br>");
    answerArea.append("<button class='btn btn-secondary' id='reset'>Start Over?</button>");
  },

  clicked: function(event) {
    if ($(event.target).attr("data-name") === this.questions[this.currentQuestion].correctAnswer) {
      this.answeredCorrectly();
    }
    else {
      this.answeredIncorrectly();
    }
  },

  answeredIncorrectly: function() {
    this.incorrect++;
    $("#incorrect_counter").text(this.incorrect);

    $("#txtQuestion").empty();
    answerArea.empty();
    answerArea.html("<h4 class='red-text'>Wrong Answer.</h4>");
    answerArea.append("<h4>Correct Answer: " + this.questions[this.currentQuestion].correctAnswer + "</h4></br>");

    if (this.currentQuestion === this.questions.length - 1) {
      // 10 questions finished
      this.gameOver()
    } else {
      answerArea.append("<button class='btn btn-secondary' id='btnNextQuestion'>Next Question</button>");
    }
  },

  answeredCorrectly: function() {
    this.correct++;
    $("#correct_counter").text(this.correct);

    $("#txtQuestion").empty();
    answerArea.empty();
    answerArea.html("<h4 class='green-text'>Correct Answer!</h4></br>");

    if (this.currentQuestion === this.questions.length - 1) {
      // 10 questions finished
      this.gameOver()
    } else {
      answerArea.append("<button class='btn btn-secondary' id='btnNextQuestion'>Next Question</button>");
    }
  },

  reset: function() {
    this.currentQuestion = 0;
    this.correct = 0;
    this.incorrect = 0;
    $("#correct_counter").text(this.correct);
    $("#incorrect_counter").text(this.incorrect);
    this.shuffleQuestions();
    this.loadQuestion();
  }
};

$(document).ready(function() {
  // get questions from JSON file & initialize
  // CORS policy error in Chrome due to security, but works in web server
  $.getJSON("./assets/questions.json", function(data) {
    quizApp.questions = data.questions;
  })

  // click handlers
  $(document).on("click", "#btnStart", quizApp.reset.bind(quizApp))
  $(document).on("click", "#reset", quizApp.reset.bind(quizApp))
  $(document).on("click", ".answer", (event) => quizApp.clicked.bind(quizApp, event)())
  $(document).on("click", "#btnNextQuestion", quizApp.nextQuestion.bind(quizApp))

})

