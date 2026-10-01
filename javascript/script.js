/* =========================
    =========================

     SCROLL LOCK — disabled while envelope is up,
     enabled once main page shows

    =========================
    ========================= */

document.body.classList.add('no-scroll');


window.onload = function () {
  window.scrollTo(0, 0);
};

if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
}

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

document.addEventListener('DOMContentLoaded', function () {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

window.addEventListener('load', function () {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

 /* =========================
    =========================
	
     SCROLL RESET ON RELOAD
	
	=========================
    ========================= */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

 /* =========================
    =========================
	
			ENVELOPE
	
	=========================
    ========================= */
	
function openInvitation() {

    const envelope = document.getElementById("envelope");
    const envelopeScreen = document.getElementById("envelopeScreen");
    const mainPage = document.getElementById("mainPage");
    const ring = envelope.querySelector(".envelope-ring");
    const music = document.getElementById("bg-music");

    if (envelope.classList.contains("open")) {
        return;
    }

    envelope.classList.add("open");

    if (music) {
        music.muted = false;
        music.volume = 1;
        music.play().catch(function(error) {
            console.log("Music playback failed:", error);
        });
    }

    /* Let the flap + seal + photos + ring settle first */
    setTimeout(function() {
        if (ring) {
            ring.classList.add("zoom-final");
        }
        envelopeScreen.classList.add("zoom-out");
    }, 3600);
	
	    /* Swap pages once the zoom finishes, and unlock scroll here */
    setTimeout(function() {
        envelopeScreen.classList.add("hide");
        mainPage.classList.add("show");

        document.body.classList.remove('no-scroll'); /* enable scroll on main page */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, 3900);
}

const weddingDate = new Date("November 28, 2026 00:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.querySelector(".countdown-container").innerHTML =
            "<h2>🎉 The Wedding Day Has Arrived!</h2>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =========================================
   MINI CALENDAR — November 2026
========================================= */

function renderMiniCalendar() {

    const container = document.getElementById("miniCalendar");
    if (!container) return;

    const dayLabels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const year = 2026;
    const month = 10;        // November (0-indexed)
    const weddingDay = 28;

    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = '<div class="mini-calendar-header">November 2026</div>';
    html += '<div class="mini-calendar-grid">';

    dayLabels.forEach(function(label) {
        html += '<span class="mini-calendar-day-label">' + label + '</span>';
    });

    for (let i = 0; i < firstWeekday; i++) {
        html += '<span></span>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const highlight = day === weddingDay ? " is-wedding-day" : "";
        html += '<span class="mini-calendar-date' + highlight + '">' + day + '</span>';
    }

    html += '</div>';
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", renderMiniCalendar);


/* =========================================
   ADD TO CALENDAR
========================================= */

const CALENDAR_EVENTS = {
    ceremony: {
        title: "Gen & Fhil's Wedding Ceremony",
        description: "Join us for the church ceremony.",
        location: "Christ Faith Assembly, Purok 1, Masaya, Rosario, Batangas",
        start: "20261128T090000",
        end:   "20261128T100000"   // ← adjust if the actual ceremony runs longer
    },
    reception: {
        title: "Gen & Fhil's Wedding Reception",
        description: "Join us for the reception right after the ceremony.",
        location: "Matala Residence, Purok 1, Alupay, Rosario, Batangas",
        start: "20261128T100000",
        end:   "20261128T180000"   // ← adjust to the actual reception end time
    }
};

function escapeICS(text) {
    return text
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");
}

function openGoogleCalendar(key) {

    const ev = CALENDAR_EVENTS[key];

    const url =
        "https://calendar.google.com/calendar/render" +
        "?action=TEMPLATE" +
        "&text=" + encodeURIComponent(ev.title) +
        "&dates=" + ev.start + "/" + ev.end +
        "&details=" + encodeURIComponent(ev.description) +
        "&location=" + encodeURIComponent(ev.location) +
        "&ctz=Asia/Manila";

    window.open(url, "_blank");
}

function downloadICS(key) {

    const ev = CALENDAR_EVENTS[key];
    const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Gen and Fhil Wedding//EN",
        "BEGIN:VEVENT",
        "UID:" + key + "-genfhil-20261128@wedding",
        "DTSTAMP:" + now,
        "DTSTART;TZID=Asia/Manila:" + ev.start,
        "DTEND;TZID=Asia/Manila:" + ev.end,
        "SUMMARY:" + escapeICS(ev.title),
        "DESCRIPTION:" + escapeICS(ev.description),
        "LOCATION:" + escapeICS(ev.location),
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = key + "-gen-fhil-wedding.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* =========================================
   OPEN RSVP FORM
========================================= */

function openRSVP() {

    const intro =
        document.getElementById("rsvpIntro");

    const form =
        document.getElementById("rsvpForm");


    intro.style.display = "none";

    form.style.display = "block";
}


/* =========================================
   SUBMIT RSVP
========================================= */

function submitRSVP() {

    const name =
        document.getElementById("guestName").value.trim();

    const attendance =
        document.getElementById("attendance").value;

    const message =
        document.getElementById("rsvpMessage");


    /* Check required fields */

    if (!name || !attendance) {

        message.textContent =
            "Please complete all fields.";

        message.className =
            "rsvp-message error";

        return;
    }


    /* Send values to Google Form */

    document.getElementById("googleName").value =
        name;

    document.getElementById("googleAttendance").value =
        attendance;


    /* Submit Google Form */

    document.getElementById("googleForm").submit();


    /* Confirmation */

    message.textContent =
        "Thank you! Your RSVP has been received.";

    message.className =
        "rsvp-message success";


    /* Clear fields */

    document.getElementById("guestName").value = "";

    document.getElementById("attendance").value = "";

}

 /* =========================
    =========================
	
          MODAL ZOOM
	
	=========================
    ========================= */
	
function openZoom(img) {
  const modal = document.getElementById('zoom-modal');
  const modalImg = document.getElementById('zoom-modal-img');

  modalImg.src = img.src;
  modal.classList.add('active');
}

function closeZoom(event) {
  const modal = document.getElementById('zoom-modal');

  // Close only if clicking background or X button
  if (event.target.id === 'zoom-modal' || event.target.id === 'zoom-close') {
    modal.classList.remove('active');
  }
}

/* =========================================
   SCROLL FADE-IN ANIMATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const animatedElements =
        document.querySelectorAll("[data-animate]");

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.15
        }
    );

    animatedElements.forEach((element) => {
        observer.observe(element);
    });

});


/* =========================================
   AUTO SLIDESHOW
========================================= */

const slideshow =
    document.querySelector(".slideshow-container");


/* Only run slideshow code if it exists */

if (slideshow) {

    const slides =
        slideshow.querySelectorAll(".slide");

    const prevButton =
        slideshow.querySelector(".slide-prev");

    const nextButton =
        slideshow.querySelector(".slide-next");

    const dots =
        slideshow.querySelectorAll(".dot");


    let currentSlide = 0;

    let slideshowTimer = null;

    let isSlideshowVisible = false;


    /* =========================================
       SHOW SLIDE
    ========================================= */

    function showSlide(index) {

        slides[currentSlide]
            .classList
            .remove("active");


        if (dots[currentSlide]) {

            dots[currentSlide]
                .classList
                .remove("active");

        }


        currentSlide = index;


        slides[currentSlide]
            .classList
            .add("active");


        if (dots[currentSlide]) {

            dots[currentSlide]
                .classList
                .add("active");

        }

    }


    /* =========================================
       NEXT SLIDE
    ========================================= */

    function nextSlide() {

        let nextIndex =
            currentSlide + 1;


        if (nextIndex >= slides.length) {

            nextIndex = 0;

        }


        showSlide(nextIndex);

    }


    /* =========================================
       PREVIOUS SLIDE
    ========================================= */

    function previousSlide() {

        let previousIndex =
            currentSlide - 1;


        if (previousIndex < 0) {

            previousIndex =
                slides.length - 1;

        }


        showSlide(previousIndex);

    }


    /* =========================================
       START AUTOPLAY
    ========================================= */

    function startSlideshow() {

        /* Prevent duplicate timers */

        if (slideshowTimer !== null) {

            return;

        }


        slideshowTimer =
            setInterval(() => {

                if (isSlideshowVisible) {

                    nextSlide();

                }

            }, 6000);

    }


    /* =========================================
       STOP AUTOPLAY
    ========================================= */

    function stopSlideshow() {

        if (slideshowTimer !== null) {

            clearInterval(slideshowTimer);

            slideshowTimer = null;

        }

    }


    /* =========================================
       RESTART AUTOPLAY
    ========================================= */

    function restartSlideshow() {

        stopSlideshow();


        if (isSlideshowVisible) {

            startSlideshow();

        }

    }


    /* =========================================
       NEXT BUTTON
    ========================================= */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                nextSlide();

                restartSlideshow();

            }
        );

    }


    /* =========================================
       PREVIOUS BUTTON
    ========================================= */

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            () => {

                previousSlide();

                restartSlideshow();

            }
        );

    }


    /* =========================================
       DOT BUTTONS
    ========================================= */

    dots.forEach((dot, index) => {

        dot.addEventListener(
            "click",
            () => {

                showSlide(index);

                restartSlideshow();

            }
        );

    });


    /* =========================================
       FIRST SLIDE
    ========================================= */

    slides[0]
        .classList
        .add("active");


    if (dots[0]) {

        dots[0]
            .classList
            .add("active");

    }


    /* =========================================
       INTERSECTION OBSERVER
    ========================================= */

    const slideshowObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        /* Viewer is on slideshow */

                        isSlideshowVisible = true;

                        startSlideshow();

                    } else {

                        /* Viewer left slideshow */

                        isSlideshowVisible = false;

                        stopSlideshow();

                    }

                });

            },
            {
                threshold: 0.4
            }
        );


    slideshowObserver.observe(slideshow);

}


/* =========================================
   VIDEO / BACKGROUND MUSIC CONTROL
========================================= */

const backgroundMusic =
    document.getElementById("bg-music");

const weddingVideo =
    document.querySelector(".wedding-video");


if (backgroundMusic && weddingVideo) {


    /* =========================================
       VIDEO STARTS
    ========================================= */

    weddingVideo.addEventListener("play", function () {

        backgroundMusic.pause();

    });


    /* =========================================
       VIDEO IS PAUSED
    ========================================= */

    weddingVideo.addEventListener("pause", function () {

        /* Resume music only if video has not ended */

        if (!weddingVideo.ended) {

            backgroundMusic.play().catch(function (error) {

                console.log(
                    "Background music could not resume:",
                    error
                );

            });

        }

    });


    /* =========================================
       VIDEO ENDS
    ========================================= */

    weddingVideo.addEventListener("ended", function () {

        backgroundMusic.play().catch(function (error) {

            console.log(
                "Background music could not resume:",
                error
            );

        });

    });

}