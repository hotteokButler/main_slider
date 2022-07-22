/*
@copyright in 'oneup-creative'
@coding by jisoo
*/

export default class Custom_slide {
  constructor(object) {
    // slide elem
    this.mainSlideContainer = object.mainSlideContainer;
    this.mainSlide = object.mainSlide;
    this.mainSlideImages = object.mainSlideImages;
    this.cloneSlide = object.value.clone;
    // pagination
    this.pagination = object.pagination.elem || null;
    this.paginationOnClass = object.pagination.class || null;
    this.paginationSet = object.pagination.set;

    // arrow
    this.prev = object.slideArrow.prev;
    this.next = object.slideArrow.next;

    // drag 거리
    this.threshold = object.value.threshold;

    // slide setting
    // this.slideWidth = this.mainSlideContainer.clientWidth;
    this.slidesLength = this.mainSlideImages.length;
    this.slideGap = object.value.slideGap;
    this.autoSlideState = object.value.autoSlide.state;
    this.autoSlideSpeed = object.value.autoSlide.speed || null;
    this.selectedlDot;

    //수정x
    this.variable = {
      slideWidth: this.mainSlideContainer.clientWidth,
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
    // // Mouse
    this.mainSlideContainer.addEventListener("mousedown", (e) => this.dragStart(e), false);

    // // Touch
    this.mainSlideContainer.addEventListener("touchstart", (e) => this.dragStart(e), false);
    this.mainSlideContainer.addEventListener("touchmove", (e) => this.dragAction(e), false);
    this.mainSlideContainer.addEventListener("touchend", (e) => this.dragEnd(e), false);

    // // Transition
    this.mainSlide.addEventListener("transitionend", (e) => {
      this.checkIndex(e);
    });

    // // Click
    this.mainSlideContainer.addEventListener("click", (e) => {
      const target = e.target;
      if (target === this.prev) {
        this.shiftSlide("prev", false);
      } else if (target === this.next) {
        this.shiftSlide("next", false);
      }
    });
    this.mainSlideContainer.addEventListener("touchend", (e) => {
      const target = e.target;

      if (target === this.prev) {
        this.shiftSlide("prev", false);
      } else if (target === this.next) {
        this.shiftSlide("next", false);
      }
    });
  }

  slideInit() {
    // 초기설정
    this.mainSlide.style.transform = `translateX(${-this.variable.slideWidth}px)`;
    // indexing
    for (let index = 0; index < this.mainSlideImages.length; index++) {
      this.mainSlideImages[index].setAttribute("data-index", index);
      if (this.paginationSet) {
        const span = document.createElement("span");
        span.setAttribute("data-index", index);
        this.pagination.appendChild(span);
      }
    }

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

    window.addEventListener("DOMContentLoaded", () => {
      this.variable.slideWidth = this.mainSlideContainer.clientWidth;
      Object.keys(this.mainSlide.children).forEach((key) => {
        this.mainSlide.children[key].style.width = `${this.variable.slideWidth}px`;
        this.mainSlide.children[key].style.height = "auto";
      });

      this.mainSlide.style.width = `${this.variable.slideWidth * Object.keys(this.mainSlide.children).length}px`;

      this.autoSlide(this.autoSlideState, this.shiftSlide, this.autoSlideSpeed);
    });

    this.index = Number(this.mainSlide.dataset.slide);

    if (this.paginationSet) {
      this.selectedlDot = this.pagination.querySelectorAll("span");
      this.selectedlDot[0].classList.add(this.paginationOnClass);
      this.pagination.addEventListener("click", this.clickPagination);
    }

    window.addEventListener(
      "resize",
      (e) => {
        this.variable.slideWidth = this.mainSlideContainer.clientWidth;
        this.mainSlide.style.width = `${this.variable.slideWidth * Object.keys(this.mainSlide.children).length}px`;
        Object.keys(this.mainSlide.children).forEach((key) => (this.mainSlide.children[key].style.width = `${this.variable.slideWidth}px`));
        this.mainSlide.style.transform = `translateX(${-this.variable.slideWidth * (this.index + 1) + this.slideGap}px)`;
        this.checkIndex();
      },
      false
    );

    //prevet scrolling
  }

  // dragStart

  dragStart = (e) => {
    e = e || window.event;
    e.preventDefault();
    this.posX1 = 0;
    this.posX2 = 0;
    this.posInitial;
    this.posFinal;

    this.posInitial = -this.variable.slideWidth * (this.index + 1) - this.slideGap;
    this.offsetLeft = this.posInitial;
    if (e.type == "touchstart") {
      this.posX1 = e.touches[0].pageX;
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
      this.posX2 = this.posX1 - e.touches[0].pageX;
      this.posX1 = e.touches[0].pageX;
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
  shiftSlide = (dir, action) => {
    this.mainSlide.classList.add("shifting");
    this.mainSlideImages.forEach((img) => {
      img.classList.remove("active");
      if (img.dataset.index === String(this.index)) {
        img.classList.add("active");
      }
    });
    if (this.allowShift) {
      // 트랜지션이 끝나면 다음 클릭 가능
      if (!action) {
        this.posInitial = -this.variable.slideWidth * (this.index + 1) + this.slideGap;
      }

      this.moveSlide(dir);
    }
    this.allowShift = false;
  };

  // moveslide

  moveSlide = (position) => {
    let value;

    // next
    if (position === "next") {
      value = this.posInitial - this.variable.slideWidth - this.slideGap;
      this.index++;
      // prev
    } else if (position === "prev") {
      value = this.posInitial + this.variable.slideWidth + this.slideGap;
      this.index--;
    }

    this.mainSlide.style.transform = `translateX(${value}px)`;
  };

  // checkIndex
  checkIndex = () => {
    this.mainSlide.classList.remove("shifting");

    setTimeout(() => {
      this.mainSlideImages.forEach((img) => img.classList.remove("active"));
    }, 100);

    if (this.index === -1) {
      this.mainSlide.style.transform = `translateX(${-(this.slidesLength * this.variable.slideWidth) - this.slideGap}px)`;
      this.index = this.slidesLength - 1;
    } else if (this.index === this.slidesLength) {
      this.mainSlide.style.transform = `translateX(${-(1 * this.variable.slideWidth) - this.slideGap}px)`;
      this.index = 0;
    }

    this.mainSlide.setAttribute("data-slide", this.index);

    if (this.paginationSet) {
      this.selectedlDot.forEach((dot) => dot.classList.remove(this.paginationOnClass));
      this.selectedlDot[this.index].classList.add(this.paginationOnClass);
    }
    this.allowShift = true; //탈주방지
  };

  clickPagination = (e) => {
    const target = e.target;
    if (target.nodeName !== "SPAN") {
      return;
    }

    this.mainSlide.classList.add("shifting");
    this.mainSlide.setAttribute("data-slide", target.dataset.index);
    this.selectedlDot.forEach((dot) => dot.classList.remove(this.paginationOnClass));
    this.index = Number(this.mainSlide.dataset.slide);
    this.selectedlDot[this.index].classList.add(this.paginationOnClass);
    this.mainSlide.style.transform = `translateX(${-((this.index + 1) * this.variable.slideWidth) - this.slideGap}px)`;
  };

  // auto slide
  autoSlide = (autoSlideState, func, speed) => {
    if (autoSlideState) {
      setInterval(function () {
        func("next", false);
      }, speed);
    } else if (!autoSlideState) {
      return;
    }
  };
}
