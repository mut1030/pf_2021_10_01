const $window = $(window);

let windowWidth = $window.width();
let windowHeight = $window.height();

$window.resize(_.throttle(function () {
  windowWidth = $window.width();
  windowHeight = $window.height();
}, 100));

$window.resize(_.throttle(function () {
  MousemoveEffect1__update();
}, 100));

let MousemoveEffect1__$el = null;
let MousemoveEffect1__lastPosX = 0;
let MousemoveEffect1__lastPosY = 0;

function MousemoveEffect1__update() {
  MousemoveEffect1__$el.each(function (index, node) {
    const $node = $(node);
    const horRes = $node.data('data-mousemove-effect1-hor-res');
    const verRes = $node.data('data-mousemove-effect1-ver-res');

    const x = (MousemoveEffect1__lastPosX - (windowWidth / 2)) * horRes;
    const y = (MousemoveEffect1__lastPosY - (windowHeight / 2)) * verRes;
    $(node).css('transform', 'translateX(' + x + 'px) translateY(' + y + 'px)');

    console.log("MousemoveEffect1__lastPosX : " + MousemoveEffect1__lastPosX);
    console.log("MousemoveEffect1__lastPosY : " + MousemoveEffect1__lastPosY);
  });
}

function MousemoveEffect1__init() {
  MousemoveEffect1__$el = $('.mousemove-effect-1-el');

  MousemoveEffect1__$el.each(function (index, node) {
    const $node = $(node);
    $node.data('data-mousemove-effect1-hor-res', $node.attr('data-mousemove-effect1-hor-res') * 1);
    $node.data('data-mousemove-effect1-ver-res', $node.attr('data-mousemove-effect1-ver-res') * 1);
  });

  const MousemoveEffect1__updateThrottled = _.throttle(function () {
    MousemoveEffect1__update();
  }, 10);

  $window.mousemove(function (e) {
    MousemoveEffect1__lastPosX = e.clientX;
    MousemoveEffect1__lastPosY = e.clientY;

    MousemoveEffect1__updateThrottled();
  });
}

MousemoveEffect1__init();

console.clear();

// 스크롤 트리거 플러그인 활성화
gsap.registerPlugin(ScrollTrigger);

function SectionGroup__init() {
  $(".section-group--horizontal-right").each(function (index, node) {
    var $group = $(node);
    var $section = $group.find(" > .section");

    gsap.to($section, {
      xPercent: 100 * ($section.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: $group,
        start: "top top",
        end: "+=" + ($section.length - 1) + "00%",
        pin: true,
        scrub: true
      }
    });
  });

  $(".section-group--horizontal-left").each(function (index, node) {
    var $group = $(node);
    var $section = $group.find(" > .section");

    gsap.to($section, {
      xPercent: -100 * ($section.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: $group,
        start: "top top",
        end: "+=" + ($section.length - 1) + "00%",
        pin: true,
        scrub: true
      }
    });
  });

  $(".section-group--stack-up").each(function (index, node) {
    var $group = $(node);
    var $section = $group.find(" > .section:not(:first-child)");

    $section.each(function (index, node) {
      var $sectionOne = $(node);

      gsap.to($sectionOne, {
        ease: "none",
        scrollTrigger: {
          trigger: $sectionOne,
          start: "top 100%",
          end: "bottom 100%",
          pin: $sectionOne.prev(),
          pinSpacing: false,
          scrub: true,
        }
      });
    });
  });
}

// 터치가 가능한 디바이스인지 체크하는 로직 시작
function detectTouchEnabled() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  }

  return false;

  // 아래 로직은 폐기 한다.
  // 왜냐하면, PC 브라우저라도 터치가 가능한게 있기 때문에, 단순히 터치가능여부를 모바일인지 아닌지로 구분하면 좋지 않다.
  /*
  return ( 'ontouchstart' in window ) || 
    ( navigator.maxTouchPoints > 0 ) || 
    ( navigator.msMaxTouchPoints > 0 );
  */
}

const isTouchEnabled = detectTouchEnabled();

function Touch__init() {
  if (isTouchEnabled) {
    $('html').addClass('touch-enabled');
  } else {
    $('html').addClass('touch-disabled');
  }

  if (isTouchEnabled == false) {
    $('body').niceScroll({
      scrollspeed: 5
    });

    $(window).resize(function () {
      setTimeout(function () {
        $('body').getNiceScroll().resize()
      }, 500);
    });
  }
}

$('body').imagesLoaded(function () {
  $('.loading').remove();
  Touch__init();
  // 터치가 가능한 디바이스인지 체크하는 로직 끝
  SectionGroup__init();
});