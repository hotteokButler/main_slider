/*
@copyright in 'oneup-creative'
@coding by jisoo
*/

export default class Custom_slide {
  constructor(object) {
    this.object = object;
    this.mainSlideContainer = object.mainSlideContainer;
    this.mainSlide = object.mainSlide;
    this.mainSlideImages = object.mainSlideImages;
    this.pagination = object.pagination.elem;
    this.paginationOnClass = object.pagination.class;

    this.prev = object.slideArrow.prev;
    this.next = object.slideArrow.next;

    this.threshold = object.value.threshold;

    this.slideWidth = this.mainSlideImages[0].clientWidth;
    this.slidesLength = this.mainSlideImages.length;
    this.slideGap = object.value.slideGap;
    this.autoSlideState = object.value.autoSlide.state;
    this.autoSlideSpeed = object.value.autoSlide.speed;
    this.selectedlDot;

    //수정x
    this.variable = {
      index: 0,
      posX1: 0,
      posX2: 0,
      posInitial: 0,
      posFinal: 0,
      allowShift: true,
      offsetLeft: 0,
    };

    this.index = this.variable.index;
    this.posX1 = this.variable.posX1;
    this.posX2 = this.variable.posX2;
    this.posInitial = this.variable.posInitial;
    this.posFinal = this.variable.posFinal;
    this.allowShift = this.variable.allowShift; //트랜지션이 끝나면 다음 클릭 가능
    this.offsetLeft = this.variable.offsetLeft;

    //수정x

    // event

    // Mouse
    this.mainSlide.onmousedown = this.dragStart;

    // Touch
    this.mainSlide.addEventListener("touchstart", (e) => this.dragStart());
    this.mainSlide.addEventListener("touchmove", (e) => this.dragAction());
    this.mainSlide.addEventListener("touchend", (e) => this.dragEnd());

    // Click
    this.prev.addEventListener("click", (e) => this.shiftSlide("prev"));
    this.next.addEventListener("click", (e) => this.shiftSlide("next"));
    this.pagination.addEventListener("click", this.clickPagination);

    // Transition
    this.mainSlide.addEventListener("transitionend", (e) => this.checkIndex());

    //window

    window.addEventListener("load", (e) => {
      this.autoSlide(this.autoSlideState);
    });
  }

  slideInit() {
    // 초기설정
    this.mainSlide.style.transform = `translateX(${-this.slideWidth}px)`;
    // indexing
    for (let index = 0; index < this.mainSlideImages.length; index++) {
      this.mainSlideImages[index].setAttribute("data-index", index);
      const span = document.createElement("span");
      span.setAttribute("data-index", index);
      this.pagination.appendChild(span);
    }
    this.selectedlDot = this.pagination.querySelectorAll(".main-slider_pagination span");
    this.selectedlDot[0].classList.add(this.paginationOnClass);

    this.mainSlide.setAttribute("data-slide", 0);

    const firstSlide = this.mainSlideImages[0];
    const lastSlide = this.mainSlideImages[this.slidesLength - 1];
    const cloneFirst = firstSlide.cloneNode(true);
    const cloneLast = lastSlide.cloneNode(true);

    // Clone slide
    cloneFirst.classList.add("cloned-slide");
    cloneFirst.removeAttribute("data-index");
    cloneLast.classList.add("cloned-slide");
    cloneLast.removeAttribute("data-index");

    this.mainSlide.appendChild(cloneFirst);
    this.mainSlide.insertBefore(cloneLast, firstSlide);

    this.index = Number(this.mainSlide.dataset.slide);
  }

  // dragStart

  dragStart = (e) => {
    e = e || window.event;
    e.preventDefault();
    this.posX1 = 0;
    this.posX2 = 0;
    this.posInitial;
    this.posFinal;

    this.posInitial = -this.slideWidth * (this.index + 1) - this.slideGap;
    this.offsetLeft = this.posInitial;
    if (e.type == "touchstart") {
      this.posX1 = e.touches[0].clientX;
    } else {
      this.posX1 = e.clientX;
      document.onmouseup = this.dragEnd;
      document.onmousemove = this.dragAction;
    }
  };

  // dragAction

  dragAction = (e) => {
    e = e || window.event;
    if (e.type == "touchmove") {
      this.posX2 = this.posX1 - e.touches[0].clientX;
      this.posX1 = e.touches[0].clientX;
    } else {
      this.posX2 = this.posX1 - e.clientX;
      this.posX1 = e.clientX;
    }
    this.offsetLeft -= this.posX2;
    this.mainSlide.style.transform = `translateX(${this.offsetLeft}px)`;
  };

  // dragEnd

  dragEnd = (e) => {
    this.posFinal = this.offsetLeft;
    if (this.posFinal - this.posInitial < -this.threshold) {
      this.shiftSlide("next", "drag");
    } else if (this.posFinal - this.posInitial > this.threshold) {
      this.shiftSlide("prev", "drag");
    }
    document.onmouseup = null;
    document.onmousemove = null;
  };

  // slideshift
  shiftSlide = (dir, action = false) => {
    this.mainSlide.classList.add("shifting");
    if (this.allowShift) {
      // 트랜지션이 끝나면 다음 클릭 가능
      if (!action) {
        this.posInitial = -this.slideWidth * (this.index + 1) - this.slideGap;
      }
      this.selectedlDot[this.index].classList.remove(this.paginationOnClass);
      this.moveSlide(dir);
    }

    this.allowShift = false;
  };

  // moveslide

  moveSlide = (position) => {
    let value;
    // next
    if (position === "next") {
      value = this.posInitial - this.slideWidth - this.slideGap;
      this.index++;
      // prev
    } else if (position === "prev") {
      value = this.posInitial + this.slideWidth + this.slideGap;
      this.index--;
    }
    this.mainSlide.style.transform = `translateX(${value}px)`;
  };

  // checkIndex
  checkIndex = () => {
    this.mainSlide.classList.remove("shifting");

    if (this.index === -1) {
      this.mainSlide.style.transform = `translateX(${-(this.slidesLength * this.slideWidth) - this.slideGap}px)`;
      this.index = this.slidesLength - 1;
    } else if (this.index === this.slidesLength) {
      this.mainSlide.style.transform = `translateX(${-(1 * this.slideWidth) - this.slideGap}px)`;
      this.index = 0;
    } else {
      this.mainSlide.style.transform = `translateX(${-((this.index + 1) * this.slideWidth) - this.slideGap}px)`;
    }
    this.mainSlide.setAttribute("data-slide", this.index);
    this.selectedlDot[this.index].classList.add(this.paginationOnClass);
    this.allowShift = true; //탈주방지
  };

  clickPagination = (e) => {
    const target = e.target;
    if (target.nodeName !== "SPAN") {
      return;
    }
    console.log("click");

    this.mainSlide.classList.add("shifting");
    this.mainSlide.setAttribute("data-slide", target.dataset.index);
    this.selectedlDot.forEach((dot) => dot.classList.remove(this.paginationOnClass));
    this.index = Number(this.mainSlide.dataset.slide);
    this.selectedlDot[this.index].classList.add(this.paginationOnClass);
    this.mainSlide.style.transform = `translateX(${-((this.index + 1) * this.slideWidth) - this.slideGap}px)`;
  };

  // auto slide
  autoSlide = (autoSlideState) => {
    const autoStart = setInterval(function () {
      this.next.click();
    }, this.autoSlideSpeed);

    if (!autoSlideState) {
      clearInterval(autoStart);
    }
  };
}
