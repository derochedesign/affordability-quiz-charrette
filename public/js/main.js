let root = document.documentElement;

let allQuestions = [];
let allProjects = [];
let quesPos = 7;
let colourPos = 0;

let tally = {
    builder:0,
    realist:0,
    seeker:0,
    corrects:0
}

const colourSets = [ //put actual rgb vals here and update --main and --secondary with it
    {main: `var(--colour-magenta)`, secondary: `var(--colour-lime)`},
    {main: `var(--colour-orange)`, secondary: `var(--colour-navy)`},
    {main: `var(--colour-navy)`, secondary: `var(--colour-pink)`},
    {main: `var(--colour-lime)`, secondary: `var(--colour-navy)`},
    {main: `var(--colour-green)`, secondary: `var(--colour-orange)`}
]

const mainElem = document.getElementById("main");
const bodyElem = document.getElementById("body");

document.addEventListener("DOMContentLoaded", _ => {
    
    $.getJSON('data/questions.json', function(result) { 
           
         allQuestions = [...result.questions];
         init();
    });
    $.getJSON('data/projects.json', function(result) { 
           
        allProjects = [...result.projects];
   });
   
    if (typeof typeData !== 'undefined') {
        
       const shareOutMain = document.getElementById("shareOut");
       if (typeData == "seeker" || typeData == "builder" || typeData == "realist") {
            shareOutMain.innerHTML = `<img src="../img/art/${typeData}.svg" alt="The ${typeData}"><h1 class="outcome-label">They are<br> a <span>${typeData}</span>.</h1>`;
       }
       else {
            shareOutMain.innerHTML = `<img class="share-none" src="../img/art/none404.svg"><h1 class="outcome-label">They are<br> a <span>${typeData}</span>?</h1>`;
       }
       
   }
    
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
                
                //unstyle answer
                rightA.classList.remove("selected");
                rightA.style.transform = `scale(1)`;
                leftA.classList.remove("selected");
                leftA.style.transform = `scale(1)`;
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
            root.style.setProperty('--colour-main', colourSets[colourPos].main);
            root.style.setProperty('--colour-secondary', colourSets[colourPos].secondary);
            
        }
    }
    
    
});

document.addEventListener("click", e => {
    
    const exhbPop = document.getElementById("exhbPop");
    const projectPop = document.getElementById("projectPop");
    
    if (e.target.matches(".answerBtns")) {
        if (!e.target.classList.contains("selected")) {
            handleQuestions(Number(e.target.dataset.answer));
            bodyElem.scrollTop = 0;
        }
    }
    
    if (e.target.matches("#nextBtn")) {
        console.log(quesPos);
        bodyElem.scrollTop = 0;
        nextQuestion();
    }
    
    if (e.target.matches(".projectSelect")) {
        populateProjectPop(e.target.dataset.projId);
    }
    
    if (e.target.matches("#closeProjPop")) {
        projectPop.classList.remove("active");
        bodyElem.style.overflow = "auto";
    }
    
    if (e.target.matches("#touchExhbPop")) {
        exhbPop.classList.add("active");
        bodyElem.style.overflow = "hidden";
    }
    
    if (e.target.matches("#closeExhb")) {
        exhbPop.classList.remove("active");
        bodyElem.style.overflow = "auto";
    }
    
});

const populateProjectPop = id => {
    
    const projectPop = document.getElementById("projectPop");
    projectPop.classList.add("active");
    bodyElem.style.overflow = "hidden";
    projectPop.innerHTML = projectFullTemplate(allProjects[allProjects.findIndex(project => project.id == id)]);
}

const nextQuestion = _ => {
    
    mainElem.classList.toggle("stage-question");
    mainElem.classList.toggle("stage-answer");
    
    document.querySelectorAll(`[data-answer]`).forEach(ans => ans.classList.remove("selected"));
    
    if (quesPos < allQuestions.length-1) {
        quesPos++;
        generateQuestion(allQuestions[quesPos], quesPos);
    }
    else if (quesPos == allQuestions.length-1) {
        //done
        generateOutcome();
    }
    
    //colours
    if (colourPos <= 3) {
        colourPos++;
    }
    else if (colourPos == 4) {
        colourPos = 0;
    }
    
    root.style.setProperty('--colour-main', colourSets[colourPos].main);
    root.style.setProperty('--colour-secondary', colourSets[colourPos].secondary);
    
}

const generateQuestion = (qu, pos) => {
    
    const questionView = document.getElementById("questionView");
    questionView.innerHTML = questionTemplate(qu, pos);
    
}

const handleQuestions = ans => {
    processOutcome(ans);
        
    mainElem.classList.toggle("stage-question");
    mainElem.classList.toggle("stage-answer");
    
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
        root.style.setProperty('--colour-main', colourSets[colourPos].secondary);
        root.style.setProperty('--colour-secondary', colourSets[colourPos].main);
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
    if (ans == allQuestions[quesPos].correct) {
        tally.corrects++;
    }
    
    console.log(tally);
    
}

const generateOutcome = _ => {
    let outcomes = [];
    let projects = [];
    
    $.getJSON('data/projects.json', function(result) {
        outcomes = [...result.outcomes];
        projects = [...result.projects];
        mainElem.innerHTML = resultsTemplate(outcomes, projects);
        mainElem.className = "final";
    });
    
}

const resultsTemplate = (data, projects) => {
    
    const persona = (Object.keys(tally).reduce((a, b) => tally[a] > tally[b] ? a : b));
    
    const thisOutcome = data[data.findIndex( dat => persona == dat.title)];
    
    const reccProj = projects[projects.findIndex( proj => thisOutcome.project == proj.id)];
    
    return (
        `
        <section class="results">
          <div class="outcome">
              <h4>Afford | <span>Results</span></h4>
              <div class="hero">
                  <img src="img/art/${thisOutcome.img}"></img>
                  <h1 class="outcome-label">
                    You are<br> a <span>${persona}</span>.
                  </h1>
              </div>
              <h2>Corrects: ${tally.corrects}/${allQuestions.length}</h2>
              <div class="share">
                <h3 class="coloured">Share Results</h3>
                <a href="https://www.facebook.com/sharer/sharer.php?u=example.org" target="_blank"><button class="button text">Facebook</button></a>
                <span>/</span>
                <a target="_blank" href="https://twitter.com/intent/tweet?text=I'm%20a%20${persona}!%20Find%20out%20what%20you%20are:%20http://url.com/share/${persona}"><button class="button text">Twitter</button></a>
              </div>
              
              
          </div>
          <div class="info-container">
            <div class="info">
              <h3 class="spaced">What does this mean?</h3>
              <p>As a <span>${persona}</span> ${thisOutcome.desc}</p> 
              <h3 class="spaced">Explore</h3>
              <p>${thisOutcome.explore}</p>
              <button data-proj-id="${reccProj.id}" type="button" class="button projectSelect invert">Learn More</button>
              <div class="try-again">
                <a href="/quiz"><button type="button" class="button text large">Go Again &#x279D;</button></a>
              </div>
            </div>
            
          </div>
          
        </section>
        `
    )
}

const questionTemplate = (data, pos) => {
    
    //set css var --time-pos: 40%;
    root.style.setProperty('--time-pos', `${(pos+1)*10}%`);
    document.getElementById(`markerCounter`).innerHTML = `${pos+1}/10`;
    
    return (
        `
            <h4>Affordability Quiz</h4>
            <h2>${data.scenario}</h2>
            <h2>${data.question}</h2>
            <h3 class="insight-label">Insight</h3>
            <p class="insight">${data.answer}</p>
        `
    )
}
  
const projectTemplate = data => {
    //<h4>${(data.sub == null) ? "" : data.sub}</h4>
    return (
    `
    <div class="project">
        <div>
            <h1>${data.title}</h1>
            <button data-proj-id="${data.id}" type="button" class="button projectSelect">Explore</button>
        </div>
        <p>Boost is an integrated strategy for transitioning workers during the rapid changed caused by automation that is affecting every industry.</p>
        <img src="img/${data.thumb}" alt="${data.title} thumb">
    </div>
    `
    )
}

const projectFullTemplate = data => {
    
    return (
        `
        <div id="closeProjPop" class="close"><span>&times;</span></div>
        <div class="content">
            <div class="local-nav">
                <img class="logo" src="img/projects/${data.title}/logo.svg" alt="${data.title} logo">
                <div class="download"><h5>Download Booklet</h5><a href="img/projects/${data.title}/booklet.pdf" target="_blank"><button type="button" class="button text">Download</button></a></div>
                ${(data.link) ? `<div class="link-out"><h5>Website</h5><a href="${data.link}"><button type="button" class="button text">${data.link}</button></a></div>` : ``}
            </div>
            
            <h3>Description</h3>
            <p>${data.desc}</p>
            <div class="gallery">
                ${data.gallery.map(media => `<figure><img src="${media.path}" alt="${media.alt}"><figcaption>${media.sub}</figcaption></figure>`).join('')}     
            </div>
        </div>
        `
    )
}