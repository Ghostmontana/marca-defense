(function () {
    "use strict";

    var header = document.querySelector(".site-header");
    var navToggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");

    function onScroll() {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 8);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (navToggle && nav) {
        navToggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        });

        nav.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                nav.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && nav.classList.contains("is-open")) {
                nav.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.focus();
            }
        });
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && !reduceMotion) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

        revealItems.forEach(function (item) {
            revealObserver.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add("is-visible");
        });
    }

    var counters = document.querySelectorAll("[data-count]");

    function animateCounter(element) {
        var target = parseInt(element.getAttribute("data-count"), 10);
        if (isNaN(target)) return;

        if (reduceMotion) {
            element.textContent = target.toLocaleString("en-US");
            return;
        }

        var duration = 1400;
        var start = null;

        function tick(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.round(target * eased).toLocaleString("en-US");
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }

    if ("IntersectionObserver" in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    } else {
        counters.forEach(animateCounter);
    }

    var form = document.getElementById("contact-form");
    var status = document.getElementById("form-status");

    if (form) {
        var fields = form.querySelectorAll("input, textarea, select");

        fields.forEach(function (field) {
            field.addEventListener("input", function () {
                field.classList.remove("invalid");
            });
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            var valid = true;

            fields.forEach(function (field) {
                if (!field.checkValidity()) {
                    valid = false;
                    field.classList.add("invalid");
                } else {
                    field.classList.remove("invalid");
                }
            });

            if (!valid) {
                if (status) {
                    status.textContent = "Please complete the highlighted fields.";
                    status.className = "form-status error";
                }
                var firstInvalid = form.querySelector(".invalid");
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            var name = form.querySelector("#name");
            var greeting = name && name.value.trim() ? name.value.trim().split(" ")[0] : "there";

            if (status) {
                status.textContent = "Thank you, " + greeting + ". Your request has been received. A member of our team will respond within one business day.";
                status.className = "form-status success";
            }

            form.reset();
        });
    }

    var year = document.getElementById("year");
    if (year) {
        year.textContent = String(new Date().getFullYear());
    }
})();
