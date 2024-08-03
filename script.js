'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

// Close modal
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Implement Smooth Scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });

  // section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); //prevents default moving to "section--3" as href in html, but we want SMOOTH SCROLLING!!!!!!
//     const id = this.getAttribute('href'); //this.href(absolute url!)
//     console.log(id);
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });

//Event Delegation
// 11, Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target); //e.target=the child element of nav__links that was clicked !!!
  e.preventDefault(); //prevents default moving to "section--3" as href in html, but we want SMOOTH SCROLLING!!!!!!

  // Matching strategy
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // Guard clause
  if (!clicked) return;

  // Remove active tab and content
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu (Nav Bar) fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); //all the links, not only first occurred!
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// Passing  OTHER "argument" into handler (handler has just ONE REAL parameter= e):
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1)); //bind RETURN ANOTHER FUNCTION with THIS set to what is in Parameter!

// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header'); //observe when header is out of the view!!!
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //90px=hight of nav bar
});
headerObserver.observe(header);

//Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries; //ONLY ONE THRESHOLD!!
  // console.log(entry);
  if (!entry.isIntersecting) return; //a first entry is triggerd always first without scroll, to that isIntersecting =false so we exclude that!
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //get target only first time when scroll down is 15% intersection of top of page, not when keep scroll and is 15% of the bottom of section!!!
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, //the section is revealed when is 15%visible
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '+200px', //make img load 200px before we reach them! (before the treshold actually reached!)
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider component
const slider = function () {
  const slides = document.querySelectorAll('.slide'); //4 slides
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  // slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`)); this is exacly goToSlide(0);

  let currSlide = 0;
  const maxSlide = slides.length; // 4 slides: slide 0, slide 1, 2, 3!!

  // Just to see all the slides once
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  //Functions

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`) //slide=e.target button slide clicked!
      .classList.add('dots__dot--active');
  };

  //Show next slide

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    ); //next slide button applies to all slides -100% translate x:
    // currSlide= 1; -100%, 0%, 100%, 200% fata de pozitia initiala 01!!!
  };

  // Increase/set 0 the current slide
  const nextSlide = function () {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++; //firts slide is 0% translateX
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }

    goToSlide(currSlide);
    activateDot(currSlide);
  };

  const init = function () {
    goToSlide(0);
    // 0%, img=100% width,  first img moved with 0 % on X
    // 100%, 2nd img moved with width 100% * 1
    // 3rd moved with 100%*2
    //4th moved with 100%*3
    createDots();
    activateDot(0);
  };
  init();
  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Next/Previous Slide using KeyBoard Arrows
  document.addEventListener('keydown', function (e) {
    // console.log(e); //which key I pressed, arrow l/r
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); //short circuiting
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      console.log(e.target);
      // const slide = e.target.dataset.slide; Destructuring!! e.target.dataset is Object, has properties!
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
//  0
// Sticky navigation (with SCROLL EVENT)
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', function () { //scroll event not so goood bcuz fires up to every scroll, too much events!!, bat espacially for older mobiles
//   console.log(window.scrollY); //dependent of the viewport size!!

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
///////////////////////////////
//////////////////////////////

// LECTURES
// 203. LifeCiclye DOM EVENTS
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM TREE BUILD!');
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   //in Chrome not necesarry, but some browsers require it!
//   console.log(e);
//   e.returnValue = ''; //no matter what we write, the same Pop Up
// });

// 198.  Sticky navigation: Intersection Observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry); //IntersectionObserverEntry {time...rootBounds..isIntersectiong: true, intersectionRatio:0.1012}
//   });
// };
// const obsOptions = {
//   root: null, //specify the element to intersect with target, null means viewport!!!
//   threshold: [0, 1, 0.2], //intersected at 10%, when happens, the callback f in called!, also can be an array!
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

// 194. DOM Traversing~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// const h1 = document.querySelector('h1');
// // Going downwards: child
// console.log(h1.querySelectorAll('.highlight')); //works no matter how deep inside the child is, only of h1 element!
// console.log(h1.childNodes); //NodeList[text, span, comment...]
// console.log(h1.children); //HTMLCollection=Live Collection=updated! [span,br,span] only html DIRECT child elements!!
// h1.firstElementChild.style.color = 'white'; //first html child
// h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
// console.log(h1.parentNode); //<div class=header=title>
// console.log(h1.parentElement); //parent node <div class=header=title> here this element is also a node*is actualy in the DOM!!!
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });
// 187.Selecting, Creating, Deleting ELEMENTS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Select Elem
// console.log(document.documentElement);
// console.log(document.body);
// const header = document.querySelector('.header'); //returns the FIRST element with that class
// const allSections = document.querySelectorAll('section');
// console.log(allSections);

// document.getElementById('.section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);
// console.log(document.getElementsByClassName('btn'));

// Creating and Inserting elements
// .insertAdjacentHTML
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// // header.prepend(message);
// header.append(message);
// // header.append(message.cloneNode(true));
// // header.before(message);
// // header.after(message);

// Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//     // message.parentElement.removeChild(message); //old way
//   });

// 188.Styles, Attributes, Classes~~~~!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// console.log(message.style.height); //not working only on inline styles we set in js!
// console.log(message.style.backgroundColor);

// console.log(getComputedStyle(message).color); //works on getting property values from css!!
// console.log(getComputedStyle(message).height); //STRING 20 PX!!

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);
// logo.alt = 'Beautiful logo';
// // Non-standard
// console.log(logo.designer); //UNDEFIND
// console.log(logo.getAttribute('designer')); //Adriana
// logo.setAttribute('company', 'Bankist');
// console.log(logo.getAttribute('src'));
// const link = document.querySelector('.nav__link--btn');
// console.log(link.href); //absolute url
// console.log(link.getAttribute('href')); //relative url

// // Data attributes
// console.log(logo.dataset.versionNumber); //3.0

// Classes
// logo.classList.add('c', 'j');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c'); //not includes

//Don't use! Allows only once class and overwrites all the existing ones!!
// logo.className = 'Adriana';

// 189.Implementing SMOOTH SCROLLING~~~!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');
// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);

// console.log(e.target.getBoundingClientRect()); //relative to viewport, e.target is bntScrollTo
// console.log('Current scroll(X/Y)', window.pageXOffset, window.pageYOffset);

// console.log(
//   'height/width viewport',
//   document.documentElement.clientHeight,
//   document.documentElement.clientWidth
// );

// Scrolling
// window.scrollTo(
//   s1coords.left + window.pageXOffset,
//   s1coords.top + window.pageYOffset
// );

// window.scrollTo({
//   left: s1coords.left + window.pageXOffset,
//   top: s1coords.top + window.pageYOffset,
//   behavior: 'smooth',
// });

//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// 190.Types of EVENTS and EVENT HANDLERS~~~~~~~~~~~~~~~~~~~!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// const h1 = document.querySelector('h1');
// const alertH1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading');
// };
// h1.addEventListener('mouseenter', alertH1);
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000); //you can remover event listener anywhere in the code!

// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! You are reading the heading');
// }; //OLD WAY!!!

// 191+192.Event Propagation in practice~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// rgb(155,155,155)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor(0, 255));

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget); //e.targer=where the event happended, not actually the element on which is set!!!
//   console.log(e.currentTarget === this);
// });
// Stop propagation
// e.stopPropagation(); //Event never arrives on the parents elements(not good idea in practice!)!!!!!!!!!!!!
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//   }
//   // true
// );
//the NAV listens first the event, then the target, includes CAPTURE PHASE, not bubbling, first NAV( from target), LINK(target), CONTAINER (listens to BUBBLING EVENT OF target a link!)
