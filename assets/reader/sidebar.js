/* Collapsible sections use HonKit's native nested summary and heading links. */
require(["gitbook"], function (gitbook) {
    "use strict";

    let savedSections = Object.create(null);

    function save() {
        gitbook.storage.set("sidebarSections", savedSections);
    }

    function setExpanded(button, expanded, remember = true) {
        const children = document.getElementById(button.getAttribute("aria-controls"));
        children.hidden = !expanded;
        button.setAttribute("aria-expanded", String(expanded));
        const label = (expanded ? "Collapse " : "Expand ") + button.dataset.chapterTitle;
        button.setAttribute("aria-label", label);
        button.title = label;
        if (remember) savedSections[button.dataset.sectionKey] = expanded;
    }

    function mount() {
        const summary = document.querySelector(".book-summary ul.summary");
        if (!summary) return;

        summary.querySelectorAll("li.chapter").forEach(function (chapter, index) {
            const children = chapter.querySelector(":scope > ul.articles");
            const link = chapter.querySelector(":scope > a, :scope > span");
            if (!children || !link || chapter.querySelector(":scope > .toc-toggle")) return;

            chapter.classList.add("toc-branch");
            children.id = "toc-sections-" + index;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "toc-toggle";
            button.setAttribute("aria-controls", children.id);
            button.dataset.chapterTitle = link.textContent.trim();
            // Absolute paths keep a section's saved state stable across nested page URLs.
            const href = link.getAttribute("href");
            const url = href ? new URL(href, document.baseURI) : null;
            button.dataset.sectionKey = url ? url.pathname + url.hash : chapter.dataset.level;
            chapter.insertBefore(button, link);

            const saved = savedSections[button.dataset.sectionKey];
            const currentHash = window.location.hash;
            const containsCurrentSection = currentHash && Array.from(children.querySelectorAll("a[href]")).some(function (child) {
                const target = new URL(child.getAttribute("href"), document.baseURI);
                return target.pathname === window.location.pathname && target.hash === currentHash;
            });
            const active = chapter.classList.contains("active") ||
                Boolean(chapter.querySelector(".chapter.active")) || Boolean(containsCurrentSection);
            // Open the current chapter on first visit; retain deliberate expand/collapse choices.
            setExpanded(button, typeof saved === "boolean" ? saved : active, false);

            button.addEventListener("click", function (event) {
                event.stopPropagation();
                setExpanded(button, button.getAttribute("aria-expanded") !== "true");
                save();
            });
            button.addEventListener("keydown", function (event) {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                event.preventDefault();
                event.stopPropagation(); // Prevent HonKit's arrows from changing chapters.
                setExpanded(button, event.key === "ArrowRight");
                save();
            });
        });

        document.querySelectorAll("[data-toc-action]").forEach(function (button) {
            if (button.dataset.tocBound) return;
            button.dataset.tocBound = "true";
            button.addEventListener("click", function () {
                const expanded = button.dataset.tocAction === "expand";
                summary.querySelectorAll(".toc-toggle").forEach(function (toggle) {
                    setExpanded(toggle, expanded);
                });
                save();
            });
        });
    }

    gitbook.events.bind("start", function () {
        const stored = gitbook.storage.get("sidebarSections", {});
        if (stored && typeof stored === "object" && !Array.isArray(stored)) {
            Object.keys(stored).forEach(function (key) {
                if (typeof stored[key] === "boolean") savedSections[key] = stored[key];
            });
        }
    });
    gitbook.events.bind("page.change", mount);
});
