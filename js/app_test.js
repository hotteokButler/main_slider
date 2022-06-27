import Custom_slide from "./custom_slide.js";

// object양식

const elements = {
  // slide container
  mainSlideContainer: document.getElementById("main-slider"),
  // slide wrapper
  mainSlide: document.querySelector(".main-slider_container"),
  // slide imgs
  mainSlideImages: document.querySelectorAll(".main-slider_img"),
  // slide pagination
  pagination: document.querySelector(".main-slider_pagination"),
  // slide button
  slideArrow: {
    prev: document.getElementById("prev"),
    next: document.getElementById("next"),
  },
  // value
  value: {
    // drag 거리
    threshold: 100,
    // 마진값
    slideGap: 0,
    // 활성화된 pagination class
    paginationActiveClass: "on",
  },
};
//object 양식

const newMainSlide = new Custom_slide(elements);
newMainSlide.slideInit();
