//Select Elements
let countSpan = document.querySelector('.count span');
let animalImgDiv = document.querySelector('.animal-img');
let animalImg = document.querySelector('.animal-img img');
let animalOptions = document.querySelector('.animal-options ul');
let animalLis = document.querySelectorAll('.animal-options ul li');
let score = document.querySelector('h3 span');
let scoreDiv = document.querySelector('.score');
let correctAns = document.querySelector('.score .right span');
let incorrectAns = document.querySelector('.score .incorrect span');
let btnNewGame = document.querySelector('#newGame');

let currentIndex = 0;
let rightAnswer = 0;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questions = JSON.parse(this.responseText);
            //Number Of Question Each New Game
            let qCount = 10;
            questionNum(qCount);
            //Random Question Each New Game
            questions = questions.sort(() => Math.random() - Math.random()).slice(0, 10);

            //Add Questions Data
            addQuestionData(questions[currentIndex], qCount);

            animalLis.forEach(li => {
                li.addEventListener('click', () => {
                    let rightAnswer = questions[currentIndex].right_answer;
                    li.classList.add('active');
                    //Increase Index 
                    currentIndex++;

                    //Check The Answer after 500ms
                    setTimeout(() => {
                        checkAnswer(rightAnswer, qCount);
                    }, 500);

                    setTimeout(() => {
                        //Remove Previous Image Source
                        animalImg.src = '';
                        //Remove All Classes (active,success,wrong)
                        li.classList.remove('active');
                        li.classList.remove('success');
                        li.classList.remove('wrong');

                        //Add Questions Data To Show The Next Question
                        addQuestionData(questions[currentIndex], qCount);
                    }, 1000);

                    //Show Results
                    setTimeout(() => {
                        showResults(qCount);
                    }, 1002);
                });
            });
        }
    }
    myRequest.open("GET", "animal_questions.json", true);
    myRequest.send();
}

getQuestions();

function questionNum(num) {
    countSpan.innerHTML = num;
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        animalImg.src = `img/${obj.img}`;
        //Create Options
        animalLis.forEach((li, i) => {
            //Give each Li a dynamic Id
            li.id = `answer_${i+1}`;
            //Create for Each Li a dynamic data-attribut
            li.dataset.answer = obj[`options`][i];
            //Insert the Option in the li
            li.innerHTML = obj[`options`][i];
        });
    }
}

function checkAnswer(rAnswer, count) {
    let choosenAnswer;
    for (let i = 0; i < animalLis.length; i++) {
        if (animalLis[i].classList.contains('active')) {
            choosenAnswer = animalLis[i].dataset.answer;
            if (rAnswer === choosenAnswer) {
                animalLis[i].classList.add('success');
                rightAnswer++;
                score.innerHTML = rightAnswer;
            } else {
                animalLis[i].classList.add('wrong');
            }
        }
    }
}

//Function To Show result correct and wrong answer
function showResults(count) {
    if (currentIndex === count) {
        animalOptions.innerHTML = '';
        animalImgDiv.innerHTML = '';
        scoreDiv.style.display = 'block';
        correctAns.innerHTML = rightAnswer;
        incorrectAns.innerHTML = count - rightAnswer;
    }
}

//To Generate A New Game
btnNewGame.addEventListener('click', () => {
    window.location.reload();
});