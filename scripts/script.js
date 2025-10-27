const input = document.querySelector(".input_search");
const inputWrapper = document.querySelector(".input_wrapper");
const topLevelButton = document.querySelector(".top_level_button");
const topLevelWrapper = document.getElementById("top_level_wrapper");

function openMenuElement(children) {
  if (children.classList.contains("open")) {
    children.classList.remove("open");
    return;
  }

  children.classList.add("open");
}

/**
 * Функция получения данных
 */
async function getData() {
  try {
    const res = await fetch("./data.json");
    const { data } = await res.json();
    ALL_CHILDRENS = formatData(data);
    GLOBAL_PARENT.childrens = ALL_CHILDRENS;
    addElements([GLOBAL_PARENT], "top_level_wrapper", 0);
  } catch (e) {
    throw new Error(e);
  }
}

getData();

function changeBorderColor(e) {
  inputWrapper.style.borderColor =
    e.type === "focus" ? BORDER_COLOR_PRIMARY : BORDER_COLOR_DEFAULT;
}

input.addEventListener("focus", changeBorderColor);

input.addEventListener("focusout", changeBorderColor);

input.addEventListener("keydown", (e) => {
  if (!(e.keyCode > 47 && e.keyCode < 57) && e.keyCode !== 8 && e.key !== ".") {
    e.preventDefault();
    return false;
  }
});

input.addEventListener("input", (e) => {
  if (e.inputType === "deleteContentBackward") {
    ALL_INPUT_VALUES.pop();
    ALL_INPUT_VALUES_CACHE = new Set(ALL_INPUT_VALUES);
  }

  if (!e.target.value.endsWith(".")) {
    if (e.target.value && !ALL_INPUT_VALUES_CACHE.has(e.target.value)) {
      ALL_INPUT_VALUES.push(e.target.value);
    }
    filtered(ALL_CHILDRENS, ALL_INPUT_VALUES, 0);
    GLOBAL_PARENT.childrens = ALL_CHILDRENS;
    topLevelWrapper.innerHTML = "";
    addElements([GLOBAL_PARENT], "top_level_wrapper", 0);
  }
});
