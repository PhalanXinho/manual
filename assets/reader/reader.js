/* Reader controls extend HonKit's font menu; its plugin still owns color themes. */
require(["gitbook", "jquery"], function (gitbook, $) {
    "use strict";

    const DEFAULTS = { family: "sans", size: 16, width: 800, sidebar: 300 };
    const FAMILIES = {
        serif: { label: "Serif (Georgia)", css: 'Georgia, "Times New Roman", serif' },
        sans: { label: "Sans", css: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
        poppins: { label: "Poppins", css: 'Poppins, Arial, sans-serif' },
        times: { label: "Times New Roman", css: '"Times New Roman", Times, serif' },
        arial: { label: "Arial", css: 'Arial, Helvetica, sans-serif' },
        verdana: { label: "Verdana", css: 'Verdana, Geneva, sans-serif' }
    };
    const LIMITS = { size: [12, 40, 1], width: [480, 1400, 20], sidebar: [240, 600, 1] };
    let preferences = { ...DEFAULTS };
    let activeDrag = null;

    function normalize(name, value) {
        if (value === "" || value === null || typeof value === "boolean") return DEFAULTS[name];
        const number = Number(value);
        if (!Number.isFinite(number)) return DEFAULTS[name];
        const [min, max, step] = LIMITS[name];
        return Math.min(max, Math.max(min, min + Math.round((number - min) / step) * step));
    }

    function save() {
        // HonKit storage catches unavailable/full localStorage; in-memory settings remain usable.
        gitbook.storage.set("readerPreferences", preferences);
    }

    function sidebarWidth() {
        return Math.min(preferences.sidebar, Math.floor(window.innerWidth / 2), 600);
    }

    function apply() {
        // Root variables survive HonKit's replacement of the entire .book on navigation.
        const style = document.documentElement.style;
        style.setProperty("--reader-font", FAMILIES[preferences.family].css);
        style.setProperty("--reader-size", preferences.size + "px");
        style.setProperty("--reader-width", preferences.width + "px");
        style.setProperty("--reader-sidebar", sidebarWidth() + "px");

        document.querySelectorAll("[data-reader-setting]").forEach(function (input) {
            input.value = preferences[input.dataset.readerSetting];
        });
        const family = document.getElementById("reader-family");
        if (family) family.value = preferences.family;

        const separator = document.querySelector(".reader-sidebar-resizer");
        if (separator) {
            separator.setAttribute("aria-valuemax", Math.min(600, Math.floor(window.innerWidth / 2)));
            separator.setAttribute("aria-valuenow", sidebarWidth());
            separator.setAttribute("aria-valuetext", sidebarWidth() + " pixels");
        }
    }

    function syncThemes() {
        const book = gitbook.state.$book[0];
        const theme = book.classList.contains("color-theme-2") ? 2 :
            book.classList.contains("color-theme-1") ? 1 : 0;
        document.querySelectorAll(".reader-themes button").forEach(function (button, index) {
            button.setAttribute("aria-pressed", index === theme ? "true" : "false");
        });
    }

    function numericControl(name, label, unit) {
        const [min, max, step] = LIMITS[name];
        return '<div class="reader-control">' +
            '<label for="reader-' + name + '-range">' + label + '</label>' +
            '<div class="reader-control-inputs">' +
            '<input id="reader-' + name + '-range" type="range" min="' + min + '" max="' + max +
            '" step="' + step + '" data-reader-setting="' + name + '" aria-label="' + label + '">' +
            '<div class="reader-number"><input id="reader-' + name + '-number" type="number" min="' +
            min + '" max="' + max + '" step="' + step + '" data-reader-setting="' + name +
            '" aria-label="' + label + ' in ' + unit + '"><span aria-hidden="true">px</span></div>' +
            '</div></div>';
    }

    function mount() {
        endDrag();
        const menu = $(".font-settings .dropdown-menu");
        if (menu.length && !menu.find(".reader-controls").length) {
            // Keep the original theme buttons and their plugin handlers.
            const themes = menu.children(".buttons").last().detach().addClass("reader-themes");
            themes.attr({ role: "group", "aria-label": "Color theme" });
            themes.find("button").each(function (index) {
                $(this).text(["White", "Sepia", "Night"][index]);
            });
            menu.children(".buttons").remove();
            const options = Object.keys(FAMILIES).map(function (key) {
                return '<option value="' + key + '">' + FAMILIES[key].label + '</option>';
            }).join("");
            menu.attr({ id: "reader-settings-panel", "aria-label": "Reading settings", lang: "en" });
            menu.append('<div class="reader-controls">' +
                '<p class="reader-title">Reading settings</p>' +
                '<div class="reader-control"><label for="reader-family">Font</label>' +
                '<select id="reader-family">' + options + '</select></div>' +
                numericControl("size", "Font size", "pixels") +
                numericControl("width", "Text width", "pixels") +
                '<p class="reader-theme-label">Color theme</p></div>');
            menu.find(".reader-controls").append(themes);
            menu.find(".reader-controls").append(
                '<button type="button" class="reader-reset">Reset settings</button>');
            $(".font-settings .toggle-dropdown").attr({
                "aria-label": "Reading settings", "aria-controls": "reader-settings-panel", lang: "en",
                "aria-expanded": "false"
            });
            menu[0].parentElement.addEventListener("keydown", handleMenuKey);
        }

        // A sibling of the scrolling summary keeps the handle reachable at any scroll position.
        const book = gitbook.state.$book[0];
        if (!book.querySelector(".reader-sidebar-resizer")) {
            const separator = document.createElement("div");
            separator.className = "reader-sidebar-resizer";
            separator.tabIndex = 0;
            separator.setAttribute("role", "separator");
            separator.setAttribute("aria-orientation", "vertical");
            separator.setAttribute("aria-label", "Table of contents width");
            separator.setAttribute("aria-valuemin", "240");
            separator.title = "Drag to resize the table of contents. Use the arrow keys to adjust its width.";
            book.appendChild(separator);
            separator.addEventListener("pointerdown", startDrag);
            separator.addEventListener("pointermove", moveDrag);
            separator.addEventListener("pointerup", endDrag);
            separator.addEventListener("pointercancel", endDrag);
            separator.addEventListener("lostpointercapture", endDrag);
            separator.addEventListener("keydown", resizeWithKeyboard);
        }
        apply();
        syncThemes();
    }

    function updateSidebar(width) {
        preferences.sidebar = normalize("sidebar", Math.min(width, window.innerWidth / 2));
        apply();
    }

    function startDrag(event) {
        if (event.button !== 0 || window.innerWidth <= 600) return;
        event.preventDefault();
        event.currentTarget.focus();
        activeDrag = {
            element: event.currentTarget, pointer: event.pointerId,
            x: event.clientX, width: sidebarWidth()
        };
        event.currentTarget.setPointerCapture(event.pointerId);
        document.documentElement.classList.add("reader-resizing");
    }

    function moveDrag(event) {
        if (!activeDrag || event.pointerId !== activeDrag.pointer) return;
        updateSidebar(activeDrag.width + event.clientX - activeDrag.x);
    }

    function endDrag() {
        if (!activeDrag) return;
        const drag = activeDrag;
        activeDrag = null;
        if (drag.element.hasPointerCapture(drag.pointer)) drag.element.releasePointerCapture(drag.pointer);
        document.documentElement.classList.remove("reader-resizing");
        save();
        $(window).trigger("resize");
    }

    function resizeWithKeyboard(event) {
        let width = sidebarWidth();
        if (event.key === "ArrowLeft") width -= event.shiftKey ? 50 : 10;
        else if (event.key === "ArrowRight") width += event.shiftKey ? 50 : 10;
        else if (event.key === "Home") width = 240;
        else if (event.key === "End") width = Math.min(600, window.innerWidth / 2);
        else return;
        event.preventDefault();
        event.stopPropagation(); // HonKit binds arrows to chapter navigation.
        updateSidebar(width);
        save();
        $(window).trigger("resize");
    }

    function handleMenuKey(event) {
        const toolbar = event.currentTarget;
        const menu = toolbar.querySelector(".dropdown-menu");
        const toggle = toolbar.querySelector(".toggle-dropdown");
        if (event.key === "Escape") {
            menu.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.focus();
            event.preventDefault();
            event.stopPropagation();
        } else if (event.key === " " && event.target === toggle) {
            event.preventDefault();
            event.stopPropagation();
            menu.classList.toggle("open");
            toggle.setAttribute("aria-expanded", menu.classList.contains("open") ? "true" : "false");
        } else if (event.key.startsWith("Arrow")) {
            event.stopPropagation();
        }
    }

    gitbook.events.bind("start", function () {
        const saved = gitbook.storage.get("readerPreferences", {});
        const legacy = gitbook.storage.get("fontState", {});
        // Preserve existing readers' supported font and size choices on their first visit.
        const initial = saved && typeof saved === "object" ? { ...saved } : {};
        if (initial.size === undefined && [0, 1, 2, 3, 4].includes(legacy.size)) {
            initial.size = [12, 14, 16, 22, 40][legacy.size];
        }
        if (initial.family === undefined && legacy.family === 0) initial.family = "serif";
        preferences.family = Object.prototype.hasOwnProperty.call(FAMILIES, initial.family) ? initial.family : DEFAULTS.family;
        ["size", "width", "sidebar"].forEach(function (name) {
            preferences[name] = normalize(name, initial[name]);
        });
        apply();

        // Delegated handlers survive the toolbar and book being rebuilt between chapters.
        $(document).on("change", "#reader-family", function () {
            preferences.family = this.value;
            apply();
            save();
        });
        $(document).on("input change", "[data-reader-setting]", function (event) {
            const name = this.dataset.readerSetting;
            // Allow intermediate number input (e.g. typing 1200) before committing.
            if (this.type === "number" && event.type === "input" &&
                (!this.validity.valid || this.value === "")) return;
            preferences[name] = normalize(name, this.value);
            apply();
            save();
        });
        $(document).on("click", ".reader-reset", function () {
            preferences = { ...DEFAULTS };
            gitbook.fontsettings.setFamily("sans");
            gitbook.fontsettings.setTheme("white");
            apply();
            syncThemes();
            save();
            $(window).trigger("resize");
        });
        $(document).on("click", ".reader-themes button", syncThemes);
        function syncDisclosure() {
            $(".font-settings .toggle-dropdown").attr("aria-expanded",
                $(".font-settings .dropdown-menu").hasClass("open") ? "true" : "false");
        }
        $(document).on("click", ".font-settings .toggle-dropdown", syncDisclosure);
        $(document).on("click", syncDisclosure);
        window.addEventListener("resize", apply);
        window.addEventListener("blur", endDrag);
    });

    gitbook.events.bind("page.change", mount);
});
