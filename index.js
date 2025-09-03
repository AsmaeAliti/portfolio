// Mobile Menu Toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Close mobile menu when clicking a link
const mobileLinks = mobileMenu.querySelectorAll("a");
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    window.scrollTo({
      top: targetElement.offsetTop - 80,
      behavior: "smooth",
    });
  });
});

(function () {
  var width,
    height,
    largeHeader,
    canvas,
    ctx,
    points,
    target,
    animateHeader = true;

  // Main
  initHeader();
  initAnimation();
  addListeners();

  function initHeader() {
    width = window.innerWidth;
    height = window.innerHeight;
    target = { x: width / 2, y: height / 2 };

    largeHeader = document.getElementById("large-header");
    largeHeader.style.height = height + "px";

    canvas = document.getElementById("demo-canvas");
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");

    // create points
    points = [];
    for (var x = 0; x < width; x = x + width / 20) {
      for (var y = 0; y < height; y = y + height / 20) {
        var px = x + (Math.random() * width) / 20;
        var py = y + (Math.random() * height) / 20;
        var p = { x: px, originX: px, y: py, originY: py };
        points.push(p);
      }
    }

    // for each point find the 5 closest points
    for (var i = 0; i < points.length; i++) {
      var closest = [];
      var p1 = points[i];
      for (var j = 0; j < points.length; j++) {
        var p2 = points[j];
        if (!(p1 == p2)) {
          var placed = false;
          for (var k = 0; k < 5; k++) {
            if (!placed) {
              if (closest[k] == undefined) {
                closest[k] = p2;
                placed = true;
              }
            }
          }

          for (var k = 0; k < 5; k++) {
            if (!placed) {
              if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                closest[k] = p2;
                placed = true;
              }
            }
          }
        }
      }
      p1.closest = closest;
    }

    // assign a circle to each point
    for (var i in points) {
      var c = new Circle(
        points[i],
        2 + Math.random() * 2,
        "rgba(255,255,255,0.3)"
      );
      points[i].circle = c;
    }
  }

  // Event handling
  function addListeners() {
    if (!("ontouchstart" in window)) {
      window.addEventListener("mousemove", mouseMove);
    }
    window.addEventListener("scroll", scrollCheck);
    window.addEventListener("resize", resize);
  }

  function mouseMove(e) {
    var posx = (posy = 0);
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx =
        e.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft;
      posy =
        e.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop;
    }
    target.x = posx;
    target.y = posy;
  }

  function scrollCheck() {
    if (document.body.scrollTop > height) animateHeader = false;
    else animateHeader = true;
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    largeHeader.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;
  }

  // animation
  function initAnimation() {
    animate();
    for (var i in points) {
      shiftPoint(points[i]);
    }
  }

  function animate() {
    if (animateHeader) {
      ctx.clearRect(0, 0, width, height);
      for (var i in points) {
        // detect points in range
        if (Math.abs(getDistance(target, points[i])) < 4000) {
          points[i].active = 0.3;
          points[i].circle.active = 0.6;
        } else if (Math.abs(getDistance(target, points[i])) < 20000) {
          points[i].active = 0.1;
          points[i].circle.active = 0.3;
        } else if (Math.abs(getDistance(target, points[i])) < 40000) {
          points[i].active = 0.02;
          points[i].circle.active = 0.1;
        } else {
          points[i].active = 0;
          points[i].circle.active = 0;
        }

        drawLines(points[i]);
        points[i].circle.draw();
      }
    }
    requestAnimationFrame(animate);
  }

  function shiftPoint(p) {
    TweenLite.to(p, 1 + 1 * Math.random(), {
      x: p.originX - 50 + Math.random() * 100,
      y: p.originY - 50 + Math.random() * 100,
      ease: Circ.easeInOut,
      onComplete: function () {
        shiftPoint(p);
      },
    });
  }

  // Canvas manipulation
  function drawLines(p) {
    if (!p.active) return;
    for (var i in p.closest) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.closest[i].x, p.closest[i].y);
      ctx.strokeStyle = "rgba(156,217,249," + p.active + ")";
      ctx.stroke();
    }
  }

  function Circle(pos, rad, color) {
    var _this = this;

    // constructor
    (function () {
      _this.pos = pos || null;
      _this.radius = rad || null;
      _this.color = color || null;
    })();

    this.draw = function () {
      if (!_this.active) return;
      ctx.beginPath();
      ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = "rgba(156,217,249," + _this.active + ")";
      ctx.fill();
    };
  }

  // Util
  function getDistance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }

  // change fav icon on chenging the tab
  const favicon = document.getElementById("favicon");
  document.addEventListener("visibilitychange", () => {
    favicon.href = document.hidden ? "../img/neutral.png" : "../img/happy.png";
  });

  // Eye following cursor section
  const eye = document.querySelector(".eye");
  const pupil = eye.querySelector(".pupil");

  // ============[ Left Eye ]===========
  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const eyeX = eye.getBoundingClientRect().left + eye.offsetWidth / 2;
    const eyeY = eye.getBoundingClientRect().top + eye.offsetHeight / 2;

    const deltaX = mouseX - eyeX;
    const deltaY = mouseY - eyeY;

    // Calculate the distance between the eye element's center and the mouse pointer's position
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const maxDistance = eye.offsetWidth / 2 - pupil.offsetWidth / 2;

    // Calculate the angle between the eye element's center and the mouse pointer's position
    const angle = Math.atan2(deltaY, deltaX);

    // Calculate the pupil's new position
    const pupilX = Math.cos(angle) * Math.min(distance, maxDistance);
    const pupilY = Math.sin(angle) * Math.min(distance, maxDistance);

    // Update the pupil element's position
    pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
  });

  // Get the eye and pupil elements
  const inside = document.querySelector(".inside");
  document.addEventListener("mousemove", (e) => {
    // Get the mouse pointer's position
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Get the eye element's position
    const eyeX = pupil.getBoundingClientRect().left + pupil.offsetWidth / 2;
    const eyeY = pupil.getBoundingClientRect().top + pupil.offsetHeight / 2;

    // Calculate the difference between the mouse position and the eye position
    const deltaX = mouseX - eyeX;
    const deltaY = mouseY - eyeY;

    // Calculate the distance between the eye element's center and the mouse pointer's position
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    // Calculate the maximum distance the pupil can move
    const maxDistance = pupil.offsetWidth / 2 - inside.offsetWidth / 2;

    // Calculate the angle between the eye element's center and the mouse pointer's position
    const angle = Math.atan2(deltaY, deltaX);

    // Calculate the pupil's new position
    const pupilX = Math.cos(angle) * Math.min(distance, maxDistance);
    const pupilY = Math.sin(angle) * Math.min(distance, maxDistance);

    // Update the pupil element's position
    inside.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
  });

  // ============[ Right Eye ]===========
  // Get the eye and pupil elements
  const eye1 = document.querySelector(".eye1");
  const pupil1 = document.querySelector(".pupil1");

  document.addEventListener("mousemove", (e) => {
    // Get the mouse pointer's position
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Get the eye element's position
    const eyeX = eye1.getBoundingClientRect().left + eye.offsetWidth / 2;
    const eyeY = eye1.getBoundingClientRect().top + eye.offsetHeight / 2;

    // Calculate the difference between the mouse position and the eye position
    const deltaX = mouseX - eyeX;
    const deltaY = mouseY - eyeY;

    // Calculate the distance between the eye element's center and the mouse pointer's position
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const maxDistance = eye1.offsetWidth / 2 - pupil1.offsetWidth / 2;

    // Calculate the angle between the eye element's center and the mouse pointer's position
    const angle = Math.atan2(deltaY, deltaX);

    // Calculate the pupil's new position
    const pupilX = Math.cos(angle) * Math.min(distance, maxDistance);
    const pupilY = Math.sin(angle) * Math.min(distance, maxDistance);

    // Update the pupil element's position
    pupil1.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
  });

  //2
  // Get the eye and pupil elements
  const inside1 = document.querySelector(".inside1");
  document.addEventListener("mousemove", (e) => {
    // Get the mouse pointer's position
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Get the eye element's position
    const eyeX = pupil1.getBoundingClientRect().left + pupil.offsetWidth / 2;
    const eyeY = pupil1.getBoundingClientRect().top + pupil.offsetHeight / 2;

    // Calculate the difference between the mouse position and the eye position
    const deltaX = mouseX - eyeX;
    const deltaY = mouseY - eyeY;

    // Calculate the distance between the eye element's center and the mouse pointer's position
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    // Calculate the maximum distance the pupil can move
    const maxDistance = pupil1.offsetWidth / 2 - inside1.offsetWidth / 2;

    // Calculate the angle between the eye element's center and the mouse pointer's position
    const angle = Math.atan2(deltaY, deltaX);

    // Calculate the pupil's new position
    const pupilX = Math.cos(angle) * Math.min(distance, maxDistance);
    const pupilY = Math.sin(angle) * Math.min(distance, maxDistance);

    // Update the pupil element's position
    inside1.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
  });

  // GSAP ScrollTrigger Horizontal Scroll section
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  
  (function ($) {
    $(document).ready(function () {
      initialiseApp();

      function initialiseApp() {
        initialiseGSAPScrollTriggerPinningHorizontal();
        initialiseLenisScroll();
      }

      function initialiseGSAPScrollTriggerPinningHorizontal() {
        let sectionPin = document.querySelector("#section_pin");

        let containerAnimation = gsap.to(sectionPin, {
          scrollTrigger: {
            trigger: "#projects",
            start: "top top",
            end: () => "+=" + sectionPin.offsetWidth,
            pin: true,
            scrub: true,
          },
          x: () =>
            -(sectionPin.scrollWidth - document.documentElement.clientWidth) +
            "px",
          ease: "none",
        });

        var imageWrappers = sectionPin.querySelectorAll(".project_wrapper");

        imageWrappers.forEach((imageWrapper) => {
          var imageWrapperID = imageWrapper.id;

          gsap.to(imageWrapper, {
            scrollTrigger: {
              trigger: imageWrapper,
              start: "left center",
              end: "right center",
              containerAnimation: containerAnimation,
              toggleClass: {
                targets: "." + imageWrapperID,
                className: "active",
              },
            },
          });
        });
      }

      function initialiseLenisScroll() {
        const lenis = new Lenis({
          smoothWheel: true,
          duration: 1.2,
        });

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
      }
    });
  })(jQuery);

  
})();
