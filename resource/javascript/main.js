function show_big_preview(element) {
    element.style.transition = "0s";
    element.classList.add("big_preview");
    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";
    overlay.addEventListener("click", close_big_preview);
}

function close_big_preview() {
    document.querySelectorAll(".big_preview").forEach((element) => {
        element.classList.remove("big_preview");
        setTimeout(() => {
            element.style.transition = "0.3s";
        }, 300);
    });
    const overlay = document.getElementById("overlay");
    overlay.removeEventListener("click", close_big_preview);
    overlay.style.display = "none";
}

function change_font_weight(font_weight) {
    document.querySelectorAll("div.outer").forEach((element) => {
        element.style.fontWeight = font_weight;
    });
}

async function main() {
    const font_list = await eel.get_font_list()();
    const preview_area = document.getElementById("preview_area");
    preview_area.textContent = "";
    document.getElementById("loading").remove();
    const sample_text = document.getElementById("sample_text_input").value;

    for (let i = 0; i < font_list.length; i++) {
        const font_name = font_list[i];
        const outer = document.createElement("div");
        outer.setAttribute("class", "outer");
        outer.setAttribute("id", font_name);
        outer.style.fontFamily = font_name;

        const inner = document.createElement("span");
        inner.setAttribute("class", "inner");
        inner.textContent = sample_text;

        const font_name_element = document.createElement("div");
        font_name_element.setAttribute("class", "font_name");
        font_name_element.textContent = font_name;

        outer.appendChild(inner);
        outer.appendChild(font_name_element);
        preview_area.appendChild(outer);
    }

    document.getElementById("preview_control").style.display = "block";

    document.querySelectorAll("div.outer").forEach((element) => {
        element.addEventListener("click", function() {
            show_big_preview(element);
        });
    });
}

const swatches_values = [
    "rgb(244, 67, 54)",
    "rgb(233, 30, 99)",
    "rgb(156, 39, 176)",
    "rgb(103, 58, 183)",
    "rgb(63, 81, 181)",
    "rgb(33, 150, 243)",
    "rgb(3, 169, 244)",
    "rgb(0, 188, 212)",
    "rgb(0, 150, 136)",
    "rgb(76, 175, 80)",
    "rgb(139, 195, 74)",
    "rgb(205, 220, 57)",
    "rgb(255, 235, 59)",
    "rgb(255, 193, 7)"
];

const components_values = {
    preview: true,
    opacity: true,
    hue: true,
    interaction: {
        hex: true,
        rgba: true,
        hsla: true,
        hsva: true,
        cmyk: true,
        input: true,
        clear: true,
        save: true,
        cancel: true
    }
};

const i18n_values = {
    "btn:save": "決定",
    "btn:clear": "リセット",
    "btn:cancel": "キャンセル"
};

const background_color_picker = Pickr.create({
    el: "#background_color_picker",
    theme: "classic",
    default: "#ffffff",
    swatches: swatches_values,
    components: components_values,
    i18n: i18n_values
});

background_color_picker.on("save", (color, instance) => {
    const selected_color = color.toHEXA().toString();
    document.body.style.background = selected_color;
    document.getElementById("preview_control").style.background = selected_color;
    document.querySelectorAll("div.outer").forEach((element) => {
        element.style.background = selected_color;
    });
    background_color_picker.hide();
});

const font_color_picker = Pickr.create({
    el: "#font_color_picker",
    theme: "classic",
    default: "#111111",
    swatches: swatches_values,
    components: components_values,
    i18n: i18n_values
});

font_color_picker.on("save", (color, instance) => {
    const selected_color = color.toHEXA().toString();
    document.body.style.color = selected_color;
    document.getElementById("preview_control").style.color = selected_color;
    document.querySelectorAll("div.outer").forEach((element) => {
        element.style.color = selected_color;
    });
    font_color_picker.hide();
});

const language_setting = navigator.language ==="ja-JP" ? "ja" : "en";
document.querySelectorAll(".multilingual").forEach((element) => {
    element.textContent = element.dataset[language_setting];
});

main();

const italic_toggle = document.getElementById("italic_toggle");
italic_toggle.addEventListener("change", function() {
    const font_style = italic_toggle.checked ? "italic" : "normal";
    document.querySelectorAll("div.outer").forEach((element) => {
        element.style.fontStyle = font_style;
    });
});

const bold_toggle = document.getElementById("bold_toggle");
bold_toggle.addEventListener("change", function() {
    const font_weight = bold_toggle.checked ? "bold" : "normal";
    if (font_weight === "bold") {
        document.getElementById("font_weight_text").value = document.getElementById("font_weight_range").value = 700;
    }
    document.querySelectorAll("div.outer").forEach((element) => {
        element.style.fontWeight = font_weight;
    });
});

const move_to_left_toggle = document.getElementById("move_to_left_toggle");
move_to_left_toggle.addEventListener("change", function() {
    const preview_control = document.getElementById("preview_control");
    const preview_area = document.getElementById("preview_area");
    if (move_to_left_toggle.checked) {
        preview_control.classList.add("left");
        preview_area.classList.add("right");
    } else {
        preview_control.classList.remove("left");
        preview_area.classList.remove("right");
    }
});

document.getElementById("sample_text_input").addEventListener("input", function() {
    const sample_text = document.getElementById("sample_text_input").value;
    document.querySelectorAll("div.outer span.inner").forEach((element) => {
        element.textContent = sample_text;
    });
});

document.getElementById("font_name_search_input").addEventListener("input", function() {
    const query = document.getElementById("font_name_search_input").value.toLowerCase();
    if (query) {
        document.querySelectorAll("div.font_name").forEach((element) => {
            if (element.textContent.toLowerCase().indexOf(query) === -1) {
                element.parentNode.style.display = "none";
            } else {
                element.parentNode.style.display = "block";
            }
        });
    } else {
        document.querySelectorAll("div.font_name").forEach((element) => {
            element.style.display = "block";
        });
    }
});

const font_weight_range = document.getElementById("font_weight_range");
const font_weight_text = document.getElementById("font_weight_text");

font_weight_range.addEventListener("input", function() {
    const font_weight = font_weight_range.value;
    font_weight_text.value = font_weight;
    change_font_weight(font_weight);
});

font_weight_text.addEventListener("input", function() {
    const font_weight = font_weight_text.value ? font_weight_text.value : 400;
    font_weight_range.value = font_weight;
    change_font_weight(font_weight);
});

font_weight_text.addEventListener("change", function() {
    if (!font_weight_text.value) {
        font_weight_text.value = 400;
    }
});

const open_about_font_weight_button = document.getElementById("open_about_font_weight_button");
open_about_font_weight_button.addEventListener("click", function() {
    document.getElementById("about_font_weight").style.display = "block";
    open_about_font_weight_button.style.display = "none";
});

const close_about_font_weight_button = document.getElementById("close_about_font_weight_button");
close_about_font_weight_button.addEventListener("click", function() {
    document.getElementById("about_font_weight").style.display = "none";
    open_about_font_weight_button.style.display = "inline-block";
});
