const mainSlideContainer = document.getElementById('main-slider');
const mainSlide = document.querySelector('.main-slider_container');
const mainSlideImages = document.querySelectorAll('.main-slider_img');
const pagination = document.querySelector('.main-slider_pagination');

const prev = document.getElementById('prev');
const next = document.getElementById('next');

// 터치시 드래그 길이
const threshold = 100;

const slideWidth = mainSlideImages[0].clientWidth;
const slidesLength = mainSlideImages.length;

for (let index = 0; index < mainSlideImages.length; index++) {
  mainSlideImages[index].setAttribute('data-index', index);
  const span = document.createElement('span');
  span.setAttribute('data-index', index);
  pagination.appendChild(span);
}

const selectedlDot = document.querySelectorAll('.main-slider_pagination span');

// 첫번째 이미지가 나타나도록 함.
mainSlide.style.transform = `translateX(${-slideWidth}px)`;
selectedlDot[0].classList.add('on');

let posX1 = 0;
let posX2 = 0;
let posInitial;
let posFinal;
mainSlide.setAttribute('data-slide', 0);

const firstSlide = mainSlideImages[0];
const lastSlide = mainSlideImages[slidesLength - 1];
const cloneFirst = firstSlide.cloneNode(true);
const cloneLast = lastSlide.cloneNode(true);

// Clone slide
cloneFirst.classList.add('cloned-slide');
cloneFirst.removeAttribute('data-index');
cloneLast.classList.add('cloned-slide');
cloneLast.removeAttribute('data-index');
mainSlide.appendChild(cloneFirst);
mainSlide.insertBefore(cloneLast, firstSlide);

let index = Number(mainSlide.dataset.slide);
let allowShift = true; //  트랜지션이 끝나면 다음 클릭 가능
let offsetLeft;

//drag
const dragStart = (e) => {
  e = e || window.event;
  e.preventDefault();
  posInitial = -slideWidth * (index + 1);
  offsetLeft = posInitial;
  if (e.type == 'touchstart') {
    posX1 = e.touches[0].clientX;
  } else {
    posX1 = e.clientX;
    document.onmouseup = dragEnd;
    document.onmousemove = dragAction;
  }
};

const dragAction = (e) => {
  e = e || window.event;
  if (e.type == 'touchmove') {
    posX2 = posX1 - e.touches[0].clientX;
    posX1 = e.touches[0].clientX;
  } else {
    posX2 = posX1 - e.clientX;
    posX1 = e.clientX;
  }
  offsetLeft -= posX2;
  mainSlide.style.transform = 'translateX(' + offsetLeft + 'px)';
};

const dragEnd = (e) => {
  posFinal = offsetLeft;
  if (posFinal - posInitial < -threshold) {
    shiftSlide('next', 'drag');
  } else if (posFinal - posInitial > threshold) {
    shiftSlide('prev', 'drag');
  }
  document.onmouseup = null;
  document.onmousemove = null;
};

const moveSlide = (position) => {
  let value;
  // next
  if (position === 'next') {
    value = posInitial - slideWidth;
    index++;
    // prev
  } else if (position === 'prev') {
    value = posInitial + slideWidth;
    index--;
  }
  mainSlide.style.transform = 'translateX(' + value + 'px)';
};

//moveslide

const shiftSlide = (dir, action = false) => {
  mainSlide.classList.add('shifting');

  if (allowShift) {
    // 트랜지션이 끝나면 다음 클릭 가능
    if (!action) {
      posInitial = -slideWidth * (index + 1);
    }
    selectedlDot[index].classList.remove('on');
    moveSlide(dir);
  }

  allowShift = false;
};

//check- index

const checkIndex = () => {
  mainSlide.classList.remove('shifting');
  if (index === -1) {
    mainSlide.style.transform = 'translateX(' + -(slidesLength * slideWidth) + 'px)';
    index = slidesLength - 1;
  } else if (index === slidesLength) {
    mainSlide.style.transform = 'translateX(' + -(1 * slideWidth) + 'px)';
    index = 0;
  } else {
    mainSlide.style.transform = 'translateX(' + -((index + 1) * slideWidth) + 'px)';
  }
  mainSlide.setAttribute('data-slide', index);
  selectedlDot[index].classList.add('on');
  allowShift = true; //탈주방지
};

//pagination
const clickPagination = (e) => {
  const target = e.target;
  if (target.nodeName !== 'SPAN') {
    return;
  }
  mainSlide.classList.add('shifting');
  mainSlide.setAttribute('data-slide', target.dataset.index);
  selectedlDot.forEach((dot) => dot.classList.remove('on'));
  index = Number(mainSlide.dataset.slide);
  selectedlDot[index].classList.add('on');
  mainSlide.style.transform = 'translateX(' + -((index + 1) * slideWidth) + 'px)';
};

//Events

// Mouse
mainSlide.onmousedown = dragStart;

// Touch
mainSlide.addEventListener('touchstart', dragStart);
mainSlide.addEventListener('touchmove', dragAction);
mainSlide.addEventListener('touchend', dragEnd);

// Click
prev.addEventListener('click', (e) => shiftSlide('prev'));
next.addEventListener('click', (e) => shiftSlide('next'));
pagination.addEventListener('click', clickPagination);

// Transition
mainSlide.addEventListener('transitionend', checkIndex);
