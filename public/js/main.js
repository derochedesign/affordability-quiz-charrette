// OVERRIDE CONTEXT MENU
// if (document.addEventListener) { // IE >= 9; other browsers
//     document.addEventListener('contextmenu', function(e) {
//         alert("You've tried to open context menu"); //here you draw your own menu
//         e.preventDefault();
//     }, false);
// } else { // IE < 9
//     document.attachEvent('oncontextmenu', function() {
//         alert("You've tried to open context menu");
//         window.event.returnValue = false;
//     });
// }

//SLIDER FUNCTIONALITY
const sliderBar = document.getElementById("slider");
const sliderGrab = document.getElementById("sliderGrab");
const yes = document.getElementById("yes");
const no = document.getElementById("no");
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
    console.log("fuck");
    
    (!e.target.style.left) && (e.target.style.left = `0px`);
    
    const sliderPos = parseInt(e.target.style.left);
    
    const sliderPosition = ev => {
        if (canSlide) {
            const mouseX = (e.type == "mousedown") ? ev.clientX : ev.touches[0].clientX;
            e.target.style.left = `${sliderPos + (mouseX - mouseXog)}px`;
            
            if (no.offsetLeft <= sliderGrab.offsetLeft) {
                no.classList.add("selected");
            }
            else if ( (yes.offsetLeft + yes.offsetWidth) >= (sliderGrab.offsetLeft + sliderGrab.offsetWidth) ) {
                yes.classList.add("selected");
            }
            else {
                let selected = document.querySelectorAll(".slide-answer h2.selected");
                
                if (selected) {
                    selected.forEach(one => {
                        one.classList.remove("selected");
                    });
                }
                
            }
            
        }
    };
    
    if (e.type == "mousedown") {
        sliderBar.addEventListener("mousemove", sliderPosition);
    }
    else if (e.type == "touchstart") {
        sliderBar.addEventListener("touchmove", sliderPosition);
    }
    
}

sliderGrab.addEventListener("mousedown", e => sliderLogic(e));
sliderGrab.addEventListener("touchstart", e => sliderLogic(e));

sliderGrab.addEventListener("mouseup", resetSliderGrab);
sliderBar.addEventListener("mouseleave", resetSliderGrab);

sliderGrab.addEventListener("touchend", resetSliderGrab);


document.addEventListener("DOMContentLoaded", _ => {
    
    //custom cursor
    const cursor = document.querySelector(".custom-cursor");
    const pointerElems = [...document.querySelectorAll(".make-pointer"), ...document.querySelectorAll("button")];
    
    let cursorInit = false;
    
    document.addEventListener("touchstart", e => {
        cursor.style.display = "none";
    });
  
    for (var i = 0; i < pointerElems.length; i++) {
    
        pointerElems[i].addEventListener("mouseover", e => {
            
            if (e.currentTarget.dataset.cursorInfo == "slider") {
                console.log("on slider");
            }
            cursor.classList.add("link");
        });
        pointerElems[i].addEventListener("mouseout", _ => {
            cursor.classList.remove("link");
        });
    }
  
    window.onmousemove = e => {
        
        (!cursorInit) && (cursor.style.opacity = 1);
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        cursor.style.top = mouseY + "px";
        cursor.style.left = mouseX + "px";
      
    };
  
    window.onmouseout = _ => {
        cursor.style.opacity = 0;
        cursorInit = false;
    };
    
  });
  