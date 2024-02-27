/**
 * Variables
 */
const langBtn = document.getElementById("lang-btn"),
  menuBtn = document.getElementById("menu-btn"),
  navList = document.getElementById("nav-list"),
  fixedPosElements = [...document.querySelectorAll(".fixed-pos")],
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
  widthFactor = 1428.47,
  breakPoint = 575;

/**
 * Main flow and events
 */

menuBtn.addEventListener("click", (e) => {
  navList.classList.toggle("list--active");
  menuBtn.classList.toggle("close-icon");
  document.body.classList.toggle("overflow-hidden");
});

handleRatios();

window.addEventListener("resize", () => {
  handleRatios();
});

const servicesSwipers = servicesSwipersElements.map((swiperElement) => {
  return new Swiper(`#${swiperElement.id} .swiper`, {
    // Optional parameters
    direction: "horizontal",
    slidesPerView: 1,
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
    breakpoints: {
      // when window width is >= 320px
      900: {
        direction: "vertical",
      }
    },
    slidesPerView: 6,
    loop: true,
    spaceBetween: 30,
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
  const servicesGallery = new Swiper(`#${dialogItem.id} .gallery.swiper`, {
    // Optional parameters
    direction: "horizontal",
    slidesPerView: 1,
    // freeMode: true,
    loop: true,
    spaceBetween: 10,
  
    // Navigation arrows
    // navigation: {
    //   nextEl: ".services-button-next",
    //   prevEl: ".services-button-prev",
    // },
  
    thumbs: {
      swiper: servicesGalleryThumbs
    }
  
    // And if we need scrollbar
    //   scrollbar: {
    //     el: ".swiper-scrollbar",
    //   },
  });
})


swiperSlides.forEach(slideItem=>{
    slideItem.addEventListener('click', ()=>{
      const galleryElement = document.getElementById(slideItem.parentElement.parentElement.parentElement.getAttribute('data-gallery-id'))
        if(galleryElement){
          galleryElement.classList.add('gallery-dialog--active')
        }else{
          console.error('Error: galleryELement not found ! for id = ', slideItem.parentElement.parentElement.parentElement.getAttribute('data-gallery-id'))
        }
    })
})

imgToGallery.forEach(imgItem=>{
  imgItem.addEventListener('click', ()=>{
    const galleryElement = document.getElementById(imgItem.getAttribute('data-gallery-id'))
      if(galleryElement){
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
  if(window.scrollY > 550){
    fixedBtns.classList.add('fixed-btns--active')
  }else{
    fixedBtns.classList.remove('fixed-btns--active')
  }
})

document.getElementById('scrollTopBtn').addEventListener('click', ()=>{
  window.scrollTo(0, 0)
})

/**
 * Functions
 */
function handleRatios() {
  fixedPosElements.forEach((elmnt) => handleFixedPos(elmnt));
  if (window.innerWidth <= breakPoint) {
    mainContent.style = null;
  } else {
    mainContent.style.paddingTop = `${
      (parseFloat(getComputedStyle(document.body).width) / widthFactor) * 2000
    }px`;
  }
}
function handleFixedPos(elmnt) {
  if (window.innerWidth <= breakPoint) {
    elmnt.style.cssText = "";
  } else {
    const elmntProps = {
      x: Number(elmnt.getAttribute("data-fixed-pos-x")),
      y: Number(elmnt.getAttribute("data-fixed-pos-y")),
      factor: elmnt.classList.contains('about-seca') ? 1 :
        parseFloat(getComputedStyle(document.body).width) /
        Number(elmnt.getAttribute("data-fixed-pos-factor")),
    };
    elmnt.style.cssText = `
            left: ${elmntProps.x * elmntProps.factor}px;
            top: ${elmntProps.y * elmntProps.factor}px;
            transform: scale(${elmntProps.factor})
        `;
  }
}
