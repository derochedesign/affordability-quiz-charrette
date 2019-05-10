let root = document.documentElement;

let allQuestions = [];
let quesPos = 7;
let colourPos = 0; //0,1,2,or 3

let tally = {
    builder:0,
    realist:0,
    seeker:0
}

const colourSets = [
    {main: `--colour-magenta`, secondary: `--colour-lime`},
    {main: `--colour-navy`, secondary: `--colour-pink`},
    {main: `--colour-lime`, secondary: `--colour-navy`},
    {main: `--colour-green`, secondary: `--colour-orange`}
]

const mainElem = document.getElementById("main");

document.addEventListener("DOMContentLoaded", _ => {
    
    $.getJSON('data/questions.json', function(result) { 
           
         allQuestions = [...result.questions];
         console.log(result);
         init();
    });
    
    //SLIDER FUNCTIONALITY
    if (document.getElementById("slider")) {
        
        const sliderBar = document.getElementById("slider");
        const sliderGrab = document.getElementById("sliderGrab");
        const leftA = document.getElementById("no");
        const rightA = document.getElementById("yes");
        let canSlide = false;
        
        let answer;

        const resetSliderGrab = _ => {
            if (canSlide) {
                
                if (answer == 1) {
                    //yes
                    handleQuestions(1);
                }
                else if (answer == 0) {
                    //no
                    handleQuestions(0);
                }
                
                canSlide = false;
                sliderGrab.style.transition = `0.3s ease`;
                sliderGrab.style.left = `0px`;
                setTimeout( _ => {
                    sliderGrab.style.transition = `transform 0.3s ease`;
                },300);
            }
        };

        const sliderLogic = e => {
            console.log("m2");
            //get mouse x, consider it 0, then apply difference to sliderGrab
            const mouseXog = (e.type == "mousedown") ? e.clientX : e.touches[0].clientX;
            canSlide = true;
            
            if (!e.target.style.left) {
                e.target.style.left = `0px`;
            }
            
            const sliderPos = parseInt(e.target.style.left);
            
            const sliderPosition = ev => {
                if (canSlide) {
                    const mouseX = (e.type == "mousedown") ? ev.clientX : ev.touches[0].clientX;
                    
                    let temp = (mouseX - mouseXog);
                    (temp < 0) && (temp = temp * -1);
                    
                    if (temp <= ((sliderBar.offsetWidth/2) - (sliderGrab.offsetWidth/2) )) {
                        e.target.style.left = `${sliderPos + (mouseX - mouseXog)}px`;
                        //tracked SKEW anim
                        // sliderBar.style.transform = `perspective(50em) rotateY(${(mouseX - mouseXog)/-6}deg)`;
                    }
                    
                    if (rightA.offsetLeft <= sliderGrab.offsetLeft) {
                        rightA.classList.add("selected");
                        rightA.style.transform = `scale(1.2)`;
                        //ANSWERED YES (looping)
                        console.log("YES");
                        answer = 1;
                    }
                    else if ( (leftA.offsetLeft + leftA.offsetWidth) >= (sliderGrab.offsetLeft + sliderGrab.offsetWidth) ) {
                        leftA.classList.add("selected");
                        leftA.style.transform = `scale(1.2)`;
                        //ANSWERED NO (looping)
                        console.log("NO");
                        answer = 0;
                        
                    }
                    else {
                        let selected = document.querySelectorAll(".slide-answer h2.selected");
                        answer = null;
                        if (selected) {
                            selected.forEach(one => {
                                one.classList.remove("selected");
                                one.style.transform = `scale(1)`;
                            });
                        }
                    }
                    
                }
            };
            
            if (e.type == "mousedown") {
                document.addEventListener("mousemove", sliderPosition);
            }
            else if (e.type == "touchstart") {
                sliderBar.addEventListener("touchmove", sliderPosition);
            }
        }

        sliderGrab.addEventListener("mousedown", e => sliderLogic(e));
        sliderGrab.addEventListener("touchstart", e => sliderLogic(e));
        
        document.addEventListener("mouseup", resetSliderGrab);
        sliderGrab.addEventListener("touchend", resetSliderGrab);
        
    }
    
    //GENERATE PROJECTS
    if (document.getElementById("projectView")) {
        
        const projectView = document.getElementById("projectView");
    
        $.getJSON('data/projects.json', function(result) {
        
            result.projects.forEach(project => {
                projectView.innerHTML += projectTemplate(project); 
            });
                
        });
    }
    
    const init = _ => {
        
        //GENERATE QUESTION
        if (document.getElementById("questionView")) {
            
            //init first question 
            generateQuestion(allQuestions[quesPos], quesPos);
            
        }
    }
    
    
});

document.addEventListener("click", e => {
    
    console.log(e.target);
    

    if (e.target.matches(".answerBtns")) {
        
        handleQuestions(Number(e.target.dataset.answer));
        
    }
    
    if (e.target.matches("#nextBtn")) {
        console.log(quesPos);
        
        nextQuestion();
    }
    
});

const nextQuestion = _ => {
    
    main.classList.toggle("stage-question");
    main.classList.toggle("stage-answer");
    
    document.querySelectorAll(`[data-answer]`).forEach(ans => ans.classList.remove("selected"));
    
    if (quesPos < allQuestions.length-1) {
        console.log("fuckin");
        
        console.log(allQuestions.length-1);
        
        quesPos++;
        generateQuestion(allQuestions[quesPos], quesPos);
    }
    else if (quesPos == allQuestions.length-1) {
        //done
        generateOutcome();
    }
    
    
    if (colourPos <= 2) {
        colourPos++;
    }
    else if (colourPos == 3) {
        colourPos = 0;
    }
    
    
}

const handleQuestions = ans => {
    processOutcome(ans);
        
    main.classList.toggle("stage-question");
    main.classList.toggle("stage-answer");
    
    if (ans) {
        //yes; set yes to selected class
        document.querySelector(`[data-answer="1"]`).classList.add("selected");
        document.querySelector(`#answerLabel`).innerHTML = "Yes";
    }
    else {
        document.querySelector(`[data-answer="0"]`).classList.add("selected");
        document.querySelector(`#answerLabel`).innerHTML = "No";
    }
    
    handleColours(ans);
}

const handleColours = ans => {
    if (ans) {
        //yes
    }
    else {
        
    }
}

const processOutcome = ans => {
    if (ans) {
        //yes
        //index allQuestions for current q scores
        tally.builder += allQuestions[quesPos].yes.builder;
        tally.realist += allQuestions[quesPos].yes.realist;
        tally.seeker += allQuestions[quesPos].yes.seeker;
    }
    else {
        //no
        tally.builder += allQuestions[quesPos].no.builder;
        tally.realist += allQuestions[quesPos].no.realist;
        tally.seeker += allQuestions[quesPos].no.seeker;
    }
    console.log(tally);
    
}

const generateOutcome = _ => {
    main.innerHTML = resultsTemplate();
    main.className = "final";
}

const resultsTemplate = data => {
    return (
        `
        <section class="results">
          <div class="outcome">
              <h4>Afford | <span>Results</span></h4>
              <div class="hero">
                  <img src="img/art/seeker.svg"></img>
                  <h1 class="outcome-label">
                    You are<br> a Seeker.
                  </h1>
              </div>
              <div class="share">
                <h3 class="coloured">Share Results</h3>
                <button class="button text">Facebook</button>
                <span>/</span>
                <button class="button text">Twitter</button>
              </div>
              
              
          </div>
          <div class="info-container">
            <div class="info">
              <h3 class="spaced">What does this mean?</h3>
              <p>As a <span>Seeker</span> when it comes to affordability you envision change and your main motivator is to empower the people around you.</p> 
              <h3 class="spaced">Explore</h3>
              <p>Boost is a project that unlocks value in people, in order to create continuism aligment between workers and their jobs and make work meaningful in the face of future worker displacement.</p>
              <img class="projectSelect" src="img/temp.jpeg" alt="temporary">
              
              <button type="button" class="button">Go Again</button>
            </div>
          </div>
          
        </section>
        `
    )
}

const generateQuestion = (qu, pos) => {
    
    const questionView = document.getElementById("questionView");
    questionView.innerHTML = questionTemplate(qu, pos);
    
}

const questionTemplate = (data, pos) => {
    
    //set css var --time-pos: 40%;
    root.style.setProperty('--time-pos', `${(pos+1)*10}%`);
    
    return (
        `
            <div class="timeline">
              <div class="base-line">
                  <div class="marker">
                    <span>${pos+1}/10</span>
                  </div>
                  <div class="prog-line"></div>
              </div>
            </div>
            <div class="info">
                <h4>Affordability Quiz</h4>
                <h2>${data.scenario}</h2>
                <h2>${data.question}</h2>
                <h3 class="insight-label">Insight</h3>
                <p class="insight">${data.answer}</p>
            </div>
        `
    )
}
  
const projectTemplate = data => {
    return (
    `
    <div style="background-image:url(img/${data.thumb})" class="project">
        <h3>${data.title}</h3>
        <h4>${(data.sub == null) ? "" : data.sub}</h4>
    </div>
    `
    )
}