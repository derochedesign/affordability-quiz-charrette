document.addEventListener("DOMContentLoaded", _ => {
    
    //SLIDER FUNCTIONALITY
    if (document.getElementById("slider")) {
        
        const sliderBar = document.getElementById("slider");
        const sliderGrab = document.getElementById("sliderGrab");
        const leftA = document.getElementById("no");
        const rightA = document.getElementById("yes");
        let canSlide = false;

        const resetSliderGrab = _ => {
            
            canSlide = false;
            sliderGrab.style.transition = `0.3s ease`;
            sliderGrab.style.left = `0px`;
            setTimeout( _ => {
                sliderGrab.style.transition = `transform 0.3s ease`;
            },300);
            
        };

        const sliderLogic = e => {
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
                    }
                    else if ( (leftA.offsetLeft + leftA.offsetWidth) >= (sliderGrab.offsetLeft + sliderGrab.offsetWidth) ) {
                        leftA.classList.add("selected");
                        leftA.style.transform = `scale(1.2)`;
                        //ANSWERED NO (looping)
                        console.log("NO");
                        
                    }
                    else {
                        let selected = document.querySelectorAll(".slide-answer h2.selected");
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
    
});
  
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