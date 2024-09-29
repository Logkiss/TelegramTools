!
function(a) {
    "use strict";
    var e, t, n = localStorage.getItem("language"),
    s = "en";
    function o(t) {
        document.getElementById("header-lang-img") && ("en" == t ? document.getElementById("header-lang-img").src = "assets/images/flags/us.jpg": "sp" == t ? document.getElementById("header-lang-img").src = "assets/images/flags/spain.jpg": "gr" == t ? document.getElementById("header-lang-img").src = "assets/images/flags/germany.jpg": "it" == t ? document.getElementById("header-lang-img").src = "assets/images/flags/italy.jpg": "ru" == t && (document.getElementById("header-lang-img").src = "assets/images/flags/russia.jpg"), localStorage.setItem("language", t), "null" == (n = localStorage.getItem("language")) && o(s), a.getJSON("assets/lang/" + n + ".json",
        function(t) {
            a("html").attr("lang", n),
            a.each(t,
            function(t, e) {
                "head" === t && a(document).attr("title", e.title),
                a("[key='" + t + "']").text(e)
            })
        }))
    }
    function i() {
        var t = document.querySelectorAll(".counter-value");
        t.forEach(function(s) { !
            function t() {
                var e = +s.getAttribute("data-target"),
                a = +s.innerText,
                n = e / 250;
                n < 1 && (n = 1),
                a < e ? (s.innerText = (a + n).toFixed(0), setTimeout(t, 1)) : s.innerText = e
            } ()
        })
    }
    function r() {
        for (var t = document.getElementById("topnav-menu-content").getElementsByTagName("a"), e = 0, a = t.length; e < a; e++)"nav-item dropdown active" === t[e].parentElement.getAttribute("class") && (t[e].parentElement.classList.remove("active"), t[e].nextElementSibling.classList.remove("show"))
    }
    function l(t) {
        document.getElementById(t) && (document.getElementById(t).checked = !0)
    }
    function d() {
        document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || (console.log("pressed"), a("body").removeClass("fullscreen-enable"))
    }
    a("#side-menu").metisMenu(),
    i(),
    e = document.body.getAttribute("data-sidebar-size"),
    a(window).on("load",
    function() {
        a(".switch").on("switch-change",
        function() {
            toggleWeather()
        }),
        1024 <= window.innerWidth && window.innerWidth <= 1366 && (document.body.setAttribute("data-sidebar-size", "sm"), l("sidebar-size-small"))
    }),
    a("#vertical-menu-btn").on("click",
    function(t) {
        t.preventDefault(),
		a("body").toggleClass("menuCospan"),
        a('body', parent.document).toggleClass("sidebar-enable menubar-enable"),
        992 <= a(parent.window).width() && (null == e ? null == parent.document.body.getAttribute("data-sidebar-size") || "lg" == parent.document.body.getAttribute("data-sidebar-size") ? parent.document.body.setAttribute("data-sidebar-size", "sm") : parent.document.body.setAttribute("data-sidebar-size", "lg") : "md" == e ? "md" == parent.document.body.getAttribute("data-sidebar-size") ? parent.document.body.setAttribute("data-sidebar-size", "sm") : parent.document.body.setAttribute("data-sidebar-size", "md") : "sm" == parent.document.body.getAttribute("data-sidebar-size") ? parent.document.body.setAttribute("data-sidebar-size", "lg") : parent.document.body.setAttribute("data-sidebar-size", "sm"))
    }),
	a(document).on("click", ".menubar-overlay",
	function(t) {
		var classname = parent.document.body.getAttribute("class")
		if(classname == 'full-height-layout sidebar-enable menubar-enable'){
			parent.document.body.setAttribute("class", "full-height-layout") 
		}
	});
    a("#sidebar-menu a").each(function() {
        var t = window.location.href.split(/[?#]/)[0];
        this.href == t && (a(this).addClass("active"), a(this).parent().addClass("mm-active"), a(this).parent().parent().addClass("mm-show"), a(this).parent().parent().prev().addClass("mm-active"), a(this).parent().parent().parent().addClass("mm-active"), a(this).parent().parent().parent().parent().addClass("mm-show"), a(this).parent().parent().parent().parent().parent().addClass("mm-active"))
    }),
    a(document).ready(function() {
        var t;
        0 < a("#sidebar-menu").length && 0 < a("#sidebar-menu .mm-active .active").length && (300 < (t = a("#sidebar-menu .mm-active .active").offset().top) && (t -= 300, a(".vertical-menu .simplebar-content-wrapper").animate({
            scrollTop: t
        },
        "slow")))
    }),
    a(".navbar-nav a").each(function() {
        var t = window.location.href.split(/[?#]/)[0];
        this.href == t && (a(this).addClass("active"), a(this).parent().addClass("active"), a(this).parent().parent().addClass("active"), a(this).parent().parent().parent().addClass("active"), a(this).parent().parent().parent().parent().addClass("active"), a(this).parent().parent().parent().parent().parent().addClass("active"), a(this).parent().parent().parent().parent().parent().parent().addClass("active"))
    }),
    a('[data-toggle="fullscreen"]').on("click",
    function(t) {
        t.preventDefault(),
        a("body").toggleClass("fullscreen-enable"),
        document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement ? document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen() : document.documentElement.requestFullscreen ? document.documentElement.requestFullscreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullscreen && document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    }),
    document.addEventListener("fullscreenchange", d),
    document.addEventListener("webkitfullscreenchange", d),
    document.addEventListener("mozfullscreenchange", d),
    function() {
        if (document.getElementById("topnav-menu-content")) {
            for (var t = document.getElementById("topnav-menu-content").getElementsByTagName("a"), e = 0, a = t.length; e < a; e++) t[e].onclick = function(t) {
                "#" === t.target.getAttribute("href") && (t.target.parentElement.classList.toggle("active"), t.target.nextElementSibling.classList.toggle("show"))
            };
            window.addEventListener("resize", r)
        }
    } (),
    [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function(t) {
        return new bootstrap.Tooltip(t)
    }),
    [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]')).map(function(t) {
        return new bootstrap.Popover(t)
    }),
    [].slice.call(document.querySelectorAll(".toast")).map(function(t) {
        return new bootstrap.Toast(t)
    }),
    window.sessionStorage && ((t = sessionStorage.getItem("is_visited")) ? a("#" + t).prop("checked", !0) : sessionStorage.setItem("is_visited", "layout-ltr")),
    a("#password-addon").on("click",
    function() {
        0 < a(this).siblings("input").length && ("password" == a(this).siblings("input").attr("type") ? a(this).siblings("input").attr("type", "input") : a(this).siblings("input").attr("type", "password"))
    }),
    "null" != n && n !== s && o(n),
    a(".language").on("click",
    function(t) {
        o(a(this).attr("data-lang"))
    }),
    a(window).on("load",
    function() {
        a("#status").fadeOut(),
        a("#preloader").delay(350).fadeOut("slow")
    }),
    function() {
        a(".right-bar-toggle").on("click",
        function(t) {
            a("body").toggleClass("right-bar-enabled")
        }),
        a(document).on("click", "body",
        function(t) {
            0 < a(t.target).closest(".right-bar-toggle, .right-bar").length || a("body").removeClass("right-bar-enabled")
        });
        var t = document.getElementsByTagName("body")[0];
				
        t.hasAttribute("data-layout") && "horizontal" == t.getAttribute("data-layout") ? (l("layout-horizontal"), a(".sidebar-setting").hide()) : l("layout-vertical"),
        t.hasAttribute("data-layout-mode") && "dark" == t.getAttribute("data-layout-mode") ? l("layout-mode-dark") : l("layout-mode-light"),
        t.hasAttribute("data-layout-size") && "boxed" == t.getAttribute("data-layout-size") ? l("layout-width-boxed") : l("layout-width-fuild"),
        t.hasAttribute("data-layout-scrollable") && "true" == t.getAttribute("data-layout-scrollable") ? l("layout-position-scrollable") : l("layout-position-fixed"),
        t.hasAttribute("data-topbar") && "dark" == t.getAttribute("data-topbar") ? l("topbar-color-dark") : l("topbar-color-light"),
        t.hasAttribute("data-sidebar-size") && "sm" == t.getAttribute("data-sidebar-size") ? l("sidebar-size-small") : t.hasAttribute("data-sidebar-size") && "md" == t.getAttribute("data-sidebar-size") ? l("sidebar-size-compact") : l("sidebar-size-default"),
        t.hasAttribute("data-sidebar") && "brand" == t.getAttribute("data-sidebar") ? l("sidebar-color-brand") : t.hasAttribute("data-sidebar") && "dark" == t.getAttribute("data-sidebar") ? l("sidebar-color-dark") : l("sidebar-color-light"),
        document.getElementsByTagName("html")[0].hasAttribute("dir") && "rtl" == document.getElementsByTagName("html")[0].getAttribute("dir") ? l("layout-direction-rtl") : l("layout-direction-ltr"),
        a("input[name='layout']").on("change",
        function() {
            window.location.href = "vertical" == a(this).val() ? "index.html": "layouts-horizontal.html"
        }),
        a("input[name='layout-mode']").on("change",
        function() {
            "light" == a(this).val() ? (document.body.setAttribute("data-layout-mode", "light"), document.body.setAttribute("data-topbar", "light"), t.hasAttribute("data-layout") && "horizontal" == t.getAttribute("data-layout") || (document.body.setAttribute("data-sidebar", "dark"), l("sidebar-color-dark"))) : (document.body.setAttribute("data-layout-mode", "dark"), document.body.setAttribute("data-topbar", "dark"), t.hasAttribute("data-layout") && "horizontal" == t.getAttribute("data-layout") || document.body.setAttribute("data-sidebar", "dark"))
        }),
        a("input[name='layout-direction']").on("change",
        function() {
            "ltr" == a(this).val() ? (document.getElementsByTagName("html")[0].removeAttribute("dir"), document.getElementById("bootstrap-style").setAttribute("href", "assets/css/bootstrap.min.css"), document.getElementById("app-style").setAttribute("href", "assets/css/app.min.css")) : (document.getElementById("bootstrap-style").setAttribute("href", "assets/css/bootstrap-rtl.min.css"), document.getElementById("app-style").setAttribute("href", "assets/css/app-rtl.min.css"), document.getElementsByTagName("html")[0].setAttribute("dir", "rtl"))
        })
    } (),
    a("#checkAll").on("change",
    function() {
        a(".table-check .form-check-input").prop("checked", a(this).prop("checked"))
    }),
    a(".table-check .form-check-input").change(function() {
        a(".table-check .form-check-input:checked").length == a(".table-check .form-check-input").length ? a("#checkAll").prop("checked", !0) : a("#checkAll").prop("checked", !1)
    })
} (jQuery);