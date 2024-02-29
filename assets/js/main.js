/**
 * Variables
 */
const langBtn = document.getElementById("lang-btn"),
  menuBtn = document.getElementById("menu-btn"),
  navList = document.getElementById("nav-list"),
  fixedPosElements = [...document.querySelectorAll(".fixed-pos")],
  fixedFontElements = [...document.querySelectorAll(".fixed-font")],
  mainContent = document.getElementById("main-content"),
  swiperSlides = [...document.querySelectorAll('div[data-gallery-id] .swiper-slide')],
  imgToGallery = [...document.querySelectorAll('.img-to-gallery[data-gallery-id]')],
  fixedBtns = document.querySelector('.fixed-btns'),
  swiperDialogs = [...document.querySelectorAll('.gallery-dialog')],
  servicesSwipersElements = [
    ...document.querySelectorAll(".services-pics"),
  ],
  othServSwipersElements = [
    ...document.querySelectorAll(".oth-services-pics"),
  ],
  dialogCloseBtns = [...document.querySelectorAll('.close-dialog')],
  scrollbar = document.querySelector(".app-scrollbar"),
  scrollbarThumb = document.querySelector(".app-scrollbar__thumb"),

  timeouts = [],
  widthFactor = 1428.47,
  breakPoint = 575,
  galleryDialogs = {};

  let contentHeight = document.body.offsetHeight;
  let viewportHeight = window.innerHeight;
  let viewableRatio = null;
  let scrollbarThumbSpace = null;
  let scrollJump = null;
  let scrollTrackSpace = null;
  let IsScrollbarHandled = false;
/**
 * Main flow and events
 */

menuBtn.addEventListener("click", (e) => {
  navList.classList.toggle("list--active");
  menuBtn.classList.toggle("close-icon");
  document.body.classList.toggle("overflow-hidden");
});

[...navList.querySelectorAll('ul li a')].forEach(navBtn=>{
  navBtn.addEventListener('click', (e)=>{
    if(navList.classList.contains('list--active')) {
      navList.classList.remove('list--active')
      menuBtn.classList.remove("close-icon");
      document.body.classList.remove("overflow-hidden")
    }
  })
})

handleRatios();

window.addEventListener("resize", () => {
  handleRatios();
});

document.addEventListener('keydown', (e)=>{
  console.log('e.key = ', e.key)
  if(e.key === 'Escape'){
    const activeSwipers = swiperDialogs.filter(swiperItem => {
      return swiperItem.classList.contains('gallery-dialog--active')
    });
    if(activeSwipers.length > 0){
      activeSwipers.forEach(swiperItem=>{
        swiperItem.classList.remove('gallery-dialog--active')
      })
    }
  }
})

document.body.onload = ()=>{
  updateScrollbar();
  dragElement(scrollbarThumb, document, scrollbar);
  document.addEventListener("backbutton", (e)=>{
    const activeSwipers = swiperDialogs.filter(swiperItem => {
      return swiperItem.classList.contains('gallery-dialog--active')
    });
    if(activeSwipers.length > 0){
      e.preventDefault();
      activeSwipers.forEach(swiperItem=>{
        swiperItem.classList.remove('gallery-dialog--active')
      })
    }
  }, false);
}

const servicesSwipers = servicesSwipersElements.map((swiperElement) => {
  return new Swiper(`#${swiperElement.id} .swiper`, {
    // Optional parameters
    direction: "horizontal",
    slidesPerView: 1,
    mousewheel: {
      invert: false,
    },
    breakpoints: {
      // when window width is >= 320px
      900: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
    loop: true,
    spaceBetween: 24,

    // Navigation arrows
    navigation: {
      nextEl: `#${swiperElement.id} .services-button-next`,
      prevEl: `#${swiperElement.id} .services-button-prev`,
    },

    // And if we need scrollbar
    //   scrollbar: {
    //     el: ".swiper-scrollbar",
    //   },
  });
});

const othServSwipers = othServSwipersElements.map((swiperElement) => {
  return new Swiper(`#${swiperElement.id} .swiper`, {
    // Optional parameters
    direction: "horizontal",
    slidesPerView: 1,
    mousewheel: {
      invert: false,
    },
    breakpoints: {
      // when window width is >= 320px
      900: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
    loop: true,
    spaceBetween: 24,

    // Navigation arrows
    navigation: {
      nextEl: `#${swiperElement.id} .sec-pics-button-next`,
      prevEl: `#${swiperElement.id} .sec-pics-button-prev`,
    },

    // And if we need scrollbar
    //   scrollbar: {
    //     el: ".swiper-scrollbar",
    //   },
  });
});

swiperDialogs.forEach(dialogItem=>{
  const galleryELement = dialogItem.querySelector('.swiper.gallery')
  const thumbsELement = dialogItem.querySelector('.swiper.thumbs')
  const servicesGalleryThumbs = new Swiper(`#${dialogItem.id} .swiper.thumbs`, {
    // Optional parameters
    direction: "horizontal",
    breakpoints: {
      992: {
        direction: "vertical",
      }
    },
    mousewheel: {
      invert: false,
    },
    slidesPerView: 6,
    loop: true,
    spaceBetween: 30,
    observer: true,
    observeParents: true,
    // freeMode: true,
    // Navigation arrows
    // navigation: {
    //   nextEl: ".services-button-next",
    //   prevEl: ".services-button-prev",
    // },
  
    // And if we need scrollbar
    //   scrollbar: {
    //     el: ".swiper-scrollbar",
    //   },
  });
  galleryDialogs[dialogItem.id] = new Swiper(`#${dialogItem.id} .gallery.swiper`, {
    // Optional parameters
    direction: "horizontal",
    slidesPerView: 1,
    // freeMode: true,
    loop: true,
    mousewheel: {
      invert: false,
    },
    spaceBetween: 10,
  
    // Navigation arrows
    // navigation: {
    //   nextEl: ".services-button-next",
    //   prevEl: ".services-button-prev",
    // },
    observer: true,
    observeParents: true,
    thumbs: {
      swiper: servicesGalleryThumbs
    }
  
    // And if we need scrollbar
    //   scrollbar: {
    //     el: ".swiper-scrollbar",
    //   },
  });
})


swiperSlides.forEach((slideItem)=>{
    slideItem.addEventListener('click', ()=>{
      const galleryElementId = slideItem.parentElement.parentElement.parentElement.getAttribute('data-gallery-id');
      const slideIndex = Number(slideItem.getAttribute('data-swiper-slide-index'))
      console.log('slideItem = ', slideItem)
      console.log('slideIndex = ', slideIndex)
      const galleryElement = document.getElementById(galleryElementId)
        if(galleryElement){
          galleryDialogs[galleryElementId].slideToLoop(slideIndex)
          galleryElement.classList.add('gallery-dialog--active')
        }else{
          console.error('Error: galleryELement not found ! for id = ', slideItem.parentElement.parentElement.parentElement.getAttribute('data-gallery-id'))
        }
    })
})

imgToGallery.forEach((imgItem)=>{
  imgItem.addEventListener('click', ()=>{
    const galleryId = imgItem.getAttribute('data-gallery-id'),
     galleryElement = document.getElementById(galleryId),
     imgIndex = imgItem.getAttribute('data-img-slide-index')
      if(galleryElement){
        galleryDialogs[galleryId].slideTo(imgIndex)
        galleryElement.classList.add('gallery-dialog--active')
      }else{
        console.error('Error: galleryELement not found ! for id = ', imgItem.parentElement.parentElement.parentElement.getAttribute('data-gallery-id'))
      }
  })
})

dialogCloseBtns.forEach(btnItem=>{
  btnItem.addEventListener('click', ()=>{
    const dialog = document.getElementById(btnItem.getAttribute('data-dialog-id'))
    if(dialog){
      console.log('dialog = ', dialog)
      dialog.classList.remove('gallery-dialog--active')
    }else{
      console.log('dialog is not found ! and = ', dialog)
    }
  })
})

window.addEventListener('scroll', (e)=>{
  console.log('scrolling ...')
  scrollbarThumb.style.opacity = 1;
  for (var i=0; i<timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
  timeouts.push(
    setTimeout(() => {
      scrollbarThumb.style.opacity = ""
    }, 1000))

    if(!IsScrollbarHandled){
      scrollJump = window.scrollY * viewableRatio;
      scrollbarThumb.style.top = scrollJump + "px";
    }
  
    if(window.scrollY > 550){
    fixedBtns.classList.add('fixed-btns--active')
  }else{
    fixedBtns.classList.remove('fixed-btns--active')
  }
})

document.getElementById('scrollTopBtn').addEventListener('click', ()=>{
  window.scrollTo(0, 0)
});

[...document.querySelectorAll('.contact-form .input-field')].forEach(inpFldElmnt => {
  const inpElmnt = inpFldElmnt.querySelector('.input');
  if(inpElmnt){
    inpElmnt.addEventListener('focus', ()=>{
      inpFldElmnt.classList.add('input-field--focused')
    })
    inpElmnt.addEventListener('focusout', ()=>{
      inpFldElmnt.classList.remove('input-field--focused')
    })
    inpElmnt.addEventListener('input', (e)=>{
      e.currentTarget.value ? inpFldElmnt.classList.add('input-field--filled') : inpFldElmnt.classList.remove('input-field--filled')
    })
  }
});
/**
 * Functions
 */
function updateScrollbar() {
  contentHeight = document.body.offsetHeight;
  viewportHeight = window.innerHeight;
  viewableRatio = viewportHeight / contentHeight;
  scrollbarThumbSpace = viewableRatio * viewportHeight;
  scrollJump = window.scrollY * viewableRatio;
  scrollTrackSpace = contentHeight - viewportHeight;
  scrollbar.style.height = viewportHeight + "px";
  scrollbarThumb.style.height = viewableRatio * viewportHeight + "px";
}
function handleRatios() {
  fixedPosElements.forEach((elmnt) => handleFixedPos(elmnt));
  fixedFontElements.forEach(elmnt=>handleFixedFont(elmnt));
  document.querySelectorAll('section.sec').forEach(secElmnt=>{
    const factor = parseFloat(getComputedStyle(document.body).width) / widthFactor;
    if (parseFloat(getComputedStyle(document.body).width) <= breakPoint) {
      secElmnt.style.padding = "24px";
    } else{
      secElmnt.style.padding = `${factor * 18}px ${factor * 36}px`;
    }
  })
  if (parseFloat(getComputedStyle(document.body).width) <= breakPoint) {
    mainContent.style = null;
  } else {
    mainContent.style.paddingTop = `${
      (parseFloat(getComputedStyle(document.body).width) / widthFactor) * 1935
    }px`;
  }
}
function handleFixedPos(elmnt) {
  if (parseFloat(getComputedStyle(document.body).width) <= breakPoint) {
    elmnt.style.cssText = "";
  } else {
    const elmntProps = {
      x: Number(elmnt.getAttribute("data-fixed-pos-x")),
      y: Number(elmnt.getAttribute("data-fixed-pos-y")),
      factor: parseFloat(getComputedStyle(document.body).width) /
        Number(elmnt.getAttribute("data-fixed-pos-factor")),
    };
    elmnt.style.cssText = `
            left: ${elmntProps.x * elmntProps.factor}px;
            top: ${elmntProps.y * elmntProps.factor}px;
            transform: scale(${elmntProps.factor})
        `;
  }
}

function handleFixedFont(elmnt) {
  if (parseFloat(getComputedStyle(document.body).width) <= 768) {
    elmnt.style.cssText = "";
  } else {
    const factor = parseFloat(getComputedStyle(document.body).width) / Number(elmnt.getAttribute("data-font-size-factor"))
    elmnt.style.fontSize = `${factor * Number(elmnt.getAttribute("data-font-size"))}px`
  }
}

function dragElement(elmnt, cont, trigger = elmnt) {
    let newY = 0,
        oldY = 0,
        y;
    if (!trigger) {
        trigger = elmnt;
    }
    trigger.addEventListener("mousedown", dragMouseDown);
    trigger.addEventListener("touchstart", dragMouseDown);

    function dragMouseDown(e) {
        IsScrollbarHandled = true;
        document.documentElement.style.scrollBehavior = 'auto'
        e = e || window.event;
        // e.preventDefault();
        e.stopPropagation();
        scrollbarThumb.style.opacity = 1;
        // setTimeout(() => {
        //     scrollbarThumb.style.opacity = "";
        // }, 1000);
        // Get touch or click position
        if (
            e.type == "touchstart" ||
            e.type == "touchmove" ||
            e.type == "touchend" ||
            e.type == "touchcancel"
        ) {
            e.preventDefault();
            let evt =
                typeof e.originalEvent === "undefined" ? e : e.originalEvent;
            let touch = evt.touches[0] || evt.changedTouches[0];
            y = touch.clientY;
        } else if (
            e.type == "mousedown" ||
            e.type == "mouseup" ||
            e.type == "mousemove" ||
            e.type == "mouseover" ||
            e.type == "mouseout" ||
            e.type == "mouseenter" ||
            e.type == "mouseleave"
        ) {
            y = e.clientY;
        }
        // get the mouse cursor or touch position
        oldY = y;
        cont.addEventListener("mouseup", closeDragElement);
        cont.addEventListener("touchend", closeDragElement);
        // call a function whenever the cursor moves:
        cont.addEventListener("mousemove", elementDrag);
        cont.addEventListener("touchmove", elementDrag);
    }

    function elementDrag(e) {
        e = e || window.event;
        // e.preventDefault();
        e.stopPropagation();
        // Get touch or click event
        if (
            e.type == "touchstart" ||
            e.type == "touchmove" ||
            e.type == "touchend" ||
            e.type == "touchcancel"
        ) {
            e.preventDefault();
            let evt =
                typeof e.originalEvent === "undefined" ? e : e.originalEvent;
            let touch = evt.touches[0] || evt.changedTouches[0];
            y = touch.clientY;
        } else if (
            e.type == "mousedown" ||
            e.type == "mouseup" ||
            e.type == "mousemove" ||
            e.type == "mouseover" ||
            e.type == "mouseout" ||
            e.type == "mouseenter" ||
            e.type == "mouseleave"
        ) {
            y = e.clientY;
        }
        // check if element reached its endpoints
        if (elmnt.offsetTop < 0) {
            elmnt.style.top = 0 + "px";
            closeDragElement()
        } else if (
            elmnt.offsetTop >
            parseFloat(getComputedStyle(scrollbar).height) -
                parseFloat(getComputedStyle(elmnt).height)
        ) {
            closeDragElement()
            elmnt.style.top =
                parseFloat(getComputedStyle(scrollbar).height) -
                parseFloat(getComputedStyle(elmnt).height) -
                2 +
                "px";
        } else {
            // calculate the new cursor or touch position:
            // console.log(elmnt.offsetTop);
            newY = oldY - y;
            // store new positions as old positions
            oldY = y;
            // set the element's new position:
            elmnt.style.top = elmnt.offsetTop - newY + "px";
            window.scrollTo(0, parseFloat(elmnt.offsetTop) / viewableRatio);
        }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        cont.removeEventListener("mouseup", closeDragElement);
        cont.removeEventListener("mousemove", elementDrag);
        cont.removeEventListener("touchend", closeDragElement);
        cont.removeEventListener("touchmove", elementDrag);
        IsScrollbarHandled = false;
        document.documentElement.style.scrollBehavior = 'smooth'
    }
}
