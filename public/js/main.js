let root = document.documentElement;

let allQuestions = [];
let allProjects = [];
let quesPos = 0; //question position
let colourPos = 0;

//running global score for outcomes
let tally = {
    builder:0,
    realist:0,
    seeker:0,
    corrects:0
}

const colourSets = [ 
    {main: `var(--colour-magenta)`, secondary: `var(--colour-lime)`},
    {main: `var(--colour-orange)`, secondary: `var(--colour-navy)`},
    {main: `var(--colour-navy)`, secondary: `var(--colour-pink)`},
    {main: `var(--colour-lime)`, secondary: `var(--colour-navy)`},
    {main: `var(--colour-green)`, secondary: `var(--colour-orange)`}
]

const mainElem = document.getElementById("main");
const bodyElem = document.getElementById("body");

const handleUnload = event => {
    if (quesPos != 0) {
        event.preventDefault();
        event.returnValue = '';
    }
}

if (document.getElementById("questionView")) { 
    window.addEventListener('beforeunload', handleUnload); 
}

document.addEventListener("DOMContentLoaded", _ => {
    
    //"easy out" to setting home page's nav bar different than others
    if (window.location.pathname == "/") {
        document.getElementById("topbar").classList.add("light");
        document.querySelector('meta[name=theme-color]').setAttribute("content", getComputedStyle(root).getPropertyValue('--colour-main'));
    } 
    else {
        document.getElementById("topbar").classList.remove("light");
    }
    
    //get data
    $.getJSON('data/questions.json', function(result) { 
           
         allQuestions = [...result.questions];
         init();
    });
    $.getJSON('data/projects.json', function(result) { 
           
        allProjects = [...result.projects];
    });
   
    //using node to get the url information by passing it through a global variable in the outcomes.ejs file.
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
        
        //drop slider grab back to the center, and handle if an answer was selected
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
            //get mouse x, consider it 0, then apply difference to sliderGrab -- conditional for mouse vs touchscreen
            const mouseXog = (e.type == "mousedown") ? e.clientX : e.touches[0].clientX;
            canSlide = true;
            
            //make sure left exists
            if (!e.target.style.left) {
                e.target.style.left = `0px`;
            }
            
            const sliderPos = parseInt(e.target.style.left);
            
            const sliderPosition = ev => {
                if (canSlide) {
                    //get new x to compare to old x (Xog)
                    const mouseX = (e.type == "mousedown") ? ev.clientX : ev.touches[0].clientX;
                    
                    let diff = (mouseX - mouseXog);
                    
                    if (Math.abs(diff) <= ((sliderBar.offsetWidth/2) - (sliderGrab.offsetWidth/2) )) {
                        e.target.style.left = `${sliderPos + diff}px`;
                        //tracked SKEW anim
                        // sliderBar.style.transform = `perspective(50em) rotateY(${(mouseX - mouseXog)/-6}deg)`;
                    }
                    
                    //check right side limits
                    if (rightA.offsetLeft <= (sliderGrab.offsetLeft + 30)) {
                        rightA.classList.add("selected");
                        rightA.style.transform = `scale(1.2)`;
                        //ANSWERED YES (looping)
                        answer = 1;
                    }
                    //check left side limits
                    else if ( (leftA.offsetLeft + leftA.offsetWidth) >= (sliderGrab.offsetLeft + sliderGrab.offsetWidth - 30) ) {
                        leftA.classList.add("selected");
                        leftA.style.transform = `scale(1.2)`;
                        //ANSWERED NO (looping)
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
    
    //general init function
    const init = _ => {
        
        //GENERATE QUESTION
        if (document.getElementById("questionView")) {
            
            //init first question 
            generateQuestion(allQuestions[quesPos], quesPos);
            root.style.setProperty('--colour-main', colourSets[colourPos].main);
            root.style.setProperty('--colour-secondary', colourSets[colourPos].secondary);
            document.querySelector('meta[name=theme-color]').setAttribute("content", null);
            
        }
    }
    
    
});

//all click events
document.addEventListener("click", e => {
    
    const exhbPop = document.getElementById("exhbPop");
    const projectPop = document.getElementById("projectPop");
    
    if (e.target.matches(".answerBtns")) {
        if (!e.target.classList.contains("selected")) {
            handleQuestions(Number(e.target.dataset.answer));
        }
    }
    
    if (e.target.matches("#nextBtn")) {
        document.getElementById("questionView").scrollTop = 0;
        document.getElementById("topbar").classList.toggle("light");
        nextQuestion();
    }
    
    if (e.target.matches(".projectSelect")) {
        populateProjectPop(e.target.dataset.projId);
    }
    
    if (e.target.matches("#closeProjPop")) {
        projectPop.className = "project-pop";
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
    
    if (e.target.matches("#openSide") || e.target.matches("#closeSide")) {
        document.getElementById("sidebar").classList.toggle("active");
    }
    
});

const populateProjectPop = id => {
    
    let thisProj = allProjects[allProjects.findIndex(project => project.id == id)];
    const projectPop = document.getElementById("projectPop");
    projectPop.classList.add("active");
    projectPop.classList.add(thisProj.tid);
    bodyElem.style.overflow = "hidden";
    projectPop.innerHTML = projectFullTemplate(thisProj);
}

const nextQuestion = _ => {
    
    //these two classes change all of the css for the difference between question and answer stages of the site (only one ever exists)
    mainElem.classList.toggle("stage-question");
    mainElem.classList.toggle("stage-answer");
    
    //remove selected class from whichever answer was selected (should only ever be one selected anyway, but safe i guess)
    document.querySelectorAll(`[data-answer]`).forEach(ans => ans.classList.remove("selected"));
    
    //based on global question position, decide if to give the user the next question, or the serve the outcome
    if (quesPos < allQuestions.length-1) {
        quesPos++;
        generateQuestion(allQuestions[quesPos], quesPos);
    }
    else if (quesPos == allQuestions.length-1) {
        //done
        generateOutcome();
    }
    
    //colours position tracking (5 colour sets, 10 questions)
    if (colourPos <= colourSets.length-2) {
        colourPos++;
    }
    else if (colourPos == colourSets.length-1) {
        colourPos = 0;
    }
    
    //set main and secondary colours
    root.style.setProperty('--colour-main', colourSets[colourPos].main);
    root.style.setProperty('--colour-secondary', colourSets[colourPos].secondary);
    
    document.querySelector('meta[name=theme-color]').setAttribute("content", null);
    
}

const generateQuestion = (qu, pos) => {
    
    const questionView = document.getElementById("questionView");
    questionView.innerHTML = questionTemplate(qu, pos);
    
}

const handleQuestions = ans => {
    
    processOutcome(ans);
        
    mainElem.classList.toggle("stage-question");
    mainElem.classList.toggle("stage-answer");
    
    document.getElementById("topbar").classList.toggle("light");
    
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
    setTimeout(_ => {document.getElementById("insightLabel").scrollIntoView({behavior: "smooth"})},200);
    
}

const handleColours = ans => {
    if (!ans) {
        //answered no; flip main and secondary colours
        root.style.setProperty('--colour-main', colourSets[colourPos].secondary);
        root.style.setProperty('--colour-secondary', colourSets[colourPos].main);
    }
    
    document.querySelector('meta[name=theme-color]').setAttribute("content", getComputedStyle(root).getPropertyValue('--colour-main'));
}

const processOutcome = ans => {
    if (ans) {
        //yes
        //index allQuestions for current q position scores
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
    
}

const generateOutcome = _ => {
    
    window.removeEventListener('beforeunload', handleUnload); 
    
    let outcomes = [];
    let projects = [];
    
    //redundant
    $.getJSON('data/projects.json', function(result) {
        outcomes = [...result.outcomes];
        projects = [...result.projects];
        mainElem.innerHTML = resultsTemplate(outcomes, projects);
        mainElem.className = "final";
    });
    
}

const resultsTemplate = (data, projects) => {
    
    //filter object to get the largest value, but return the key, rather than the value 
        // const persona = (Object.keys(tally).reduce((a, b) => tally[a] > tally[b] ? a : b));
        
    //ignore above and cheat by choosing random outcome since client ran out of time...
    const persona = data[Math.floor(Math.random() * 3)].title;
    //get the chosen outcomes information (desc, project id, etc)
    const thisOutcome = data[data.findIndex( dat => persona == dat.title)];
    
    //index the outcomes projectid with the projects
    const reccProj = projects[projects.findIndex( proj => thisOutcome.project == proj.id)];
    
    root.style.setProperty('--colour-main', thisOutcome.colours.main);
    root.style.setProperty('--colour-secondary', thisOutcome.colours.secondary);
    document.querySelector('meta[name=theme-color]').setAttribute("content", null);
    
    return (
        `
        <section class="results">
          <div class="outcome">
              <div class="hero">
                  <img src="img/art/${thisOutcome.img}"></img>
                  <h1 class="outcome-label">
                    You are<br> a <span>${persona}</span>${ (tally.corrects < (allQuestions.length/2)) ? `,*` : `.` }
                  </h1>
              </div>
              
              <div class="share">
                <h3 class="coloured">Share Results</h3>
                <a href="https://www.facebook.com/sharer/sharer.php?u=http://www.perspectivesonaffordability.ca/share/${persona}" target="_blank"><button class="button text">Facebook</button></a>
                <span>/</span>
                <a target="_blank" href="https://twitter.com/intent/tweet?text=I'm%20a%20${persona}!%20What's%20your%20perspective?%20http://www.perspectivesonaffordability.ca/share/${persona}"><button class="button text">Twitter</button></a>
              </div>
              
              
          </div>
          <div class="info-container">
            <div class="info">
              <h3 class="spaced">What does this mean?</h3>
              <p>As a <span>${persona}</span> ${thisOutcome.desc}</p> 
              ${(tally.corrects < (allQuestions.length/2)) ? `<p>* although we urge you to stay open-minded on understanding other's challenges, decisions, and perspectives.</p>` : ""}
              <h3 class="spaced">Explore</h3>
              <p>${thisOutcome.explore}</p>
              <button data-proj-id="${reccProj.id}" type="button" class="button projectSelect invert">See Project</button>
              <div class="try-again">
                <a href="/quiz"><button type="button" class="button text large">Go Again</button></a>
              </div>
            </div>
            
          </div>
          
        </section>
        `
    )
}

const questionTemplate = (data, pos) => {
    
    //sets the progress bar using css var "--time-pos"
    root.style.setProperty('--time-pos', `${(pos+1)*10}%`);
    document.getElementById(`markerCounter`).innerHTML = `${pos+1}/10`;
    
    return (
        `
            <h2 class="scenario">${data.scenario}</h2>
            <h2>${data.question}</h2>
            <h3 id="insightLabel" class="insight-label">${data.insightLabel}</h3>
            <p class="insight">${data.answer}</p>
        `
    )
}

const projectFullTemplate = data => {
    
    return (
        `
        <div id="closeProjPop" class="close"><span>&times;</span></div>
        <div class="content">
            <div class="local-nav">
                ${(data.thumb) ? `<img class="logo" src="img/projects/${data.tid}/logo.svg" alt="${data.title} logo">`: ""}
                ${(data.thumb) ? `<div class="download"><h5>More Information</h5><a href="img/projects/${data.tid}/${data.tid}-booklet.pdf" target="_blank"><button type="button" class="button text">Get Booklet</button></a></div>` : ``}
                ${(data.link) ? `<div class="link-out"><h5>Website</h5><a href="${data.link}"><button type="button" class="button text">${data.link}</button></a></div>` : ``}
            </div>
            <div class="gallery">
                ${(data.gallery) ? data.gallery.map(media => `<figure><img src="${`img/${media.path}`}" alt="${media.alt}"><figcaption>${(media.sub) ? media.sub : ""}</figcaption></figure>`).join('') : ""}     
            </div>
            ${(data.thumb) ? `<h2>Description</h2>`: ""}
            <p class="desc">${data.desc}</p>
            ${(data.thumb) ? `<h2>More Information</h2>`: ""}
            ${(data.thumb) ? `<a href="img/projects/${data.tid}/${data.tid}-booklet.pdf" target="_blank"><button type="button" class="button invert">Get Booklet</button></a></div>` : ``}
        </div>
        `
    )
}