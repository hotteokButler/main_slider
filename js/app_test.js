/*
@copyright in 'oneup-creative'
@coding by jisoo
*/

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
  pagination: {
    elem: document.querySelector(".main-slider_pagination"),
    class: "on",
  },
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
    // autoslide 유무
    autoSlide: {
      state: true,
      speed: 7000,
    },
  },
};

//object 양식

const newMainSlide = new Custom_slide(elements);
newMainSlide.slideInit();
