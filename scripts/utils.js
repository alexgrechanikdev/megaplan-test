/**
 *
 * @param {*} allChildren массив всех дочерних элементов
 * @param {*} data массив всех элементов
 * @returns
 */
function getChildren(allChildren, data) {
  return allChildren.length
    ? allChildren.map((departament) => ({
        match: false,
        open: false,
        display: "block",
        parentElement: departament,
        childrens:
          null ??
          getChildren(
            data.filter((item) => item.parent === departament.id),
            data
          ),
      }))
    : null;
}

/**
 *
 * @param {*} data  массив всех элементов
 * @returns
 */
function formatData(data) {
  const parents = data.filter((item) => item.parent === null);

  return parents.map((currentParent) => ({
    match: false,
    open: false,
    display: "block",
    parentElement: currentParent,
    childrens: getChildren(
      data.filter((item) => item.parent === currentParent.id),
      data
    ),
  }));
}

/**
 *
 * @param {*} childrens все дочерние элементы
 * @param {*} values массив всех введённых значений инпута
 * @param {*} index индекс значения из массива values
 */
function filtered(childrens, values, index) {
  let res = [];
  if (values[index]) {
    for (let i = 0; i < childrens.length; i++) {
      const depNum = childrens[i].parentElement.name.split(" ")[1];
      if (!depNum.includes(values[index])) {
        childrens[i].display = "none";
        childrens[i].match = false;
      } else {
        childrens[i].display = "block";
        if (depNum === values[index] && !values[index + 1]) {
          childrens[i].match = true;
        } else {
          childrens[i].match = false;
        }

        if (childrens[i].childrens) {
          res = childrens[i].childrens;
        }
      }
    }

    if (res.length) {
      filtered(res, values, ++index);
    }
  } else {
    for (let i = 0; i < childrens.length; i++) {
      const depNum = childrens[i].parentElement.name.split(" ")[1];
      if (!depNum.includes(values[index])) {
        childrens[i].display = "block";
        if (depNum === values[index]) {
          childrens[i].match = true;
        } else {
          childrens[i].match = false;
        }
      } else {
        childrens[i].match = false;
        if (childrens[i].childrens) {
          res = childrens[i].childrens;
        }
      }
    }

    if (res.length) {
      filtered(res, values, ++index);
    }
  }
}

/**
 * Функция создания родительской обёртки
 * @param {*} element текущий элемент
 * @param {*} className имя класса элемента
 * @param {*} padding значение внутреннего отступа
 * @param {*} index индекс элемента
 */

function createParentWrapper(element, className, padding, index) {
  const newElement = document.createElement("div");
  newElement.className = className;
  newElement.style.display = element.display;
  newElement.style.marginLeft = `${(index + 1) * padding}px`;

  return newElement;
}

/**
 * Функция создания кнопки для элемента меню
 * @param {*} className имя класса элемента
 */

function createMenuButton(className) {
  const newElement = document.createElement("button");
  newElement.className = className;

  return newElement;
}

/**
 * Функция создания текста для кнопки
 * @param {*} element текущий элемент списка
 */

function createButtonText(element) {
  const newElement = document.createElement("div");
  newElement.className = `button_text_wrapper`;

  const buttonDepartamentText = document.createElement("p");
  const buttonDepartamentNumber = document.createElement("p");

  const [dep, depNum] = element.parentElement.name.split(" ");
  buttonDepartamentText.textContent = dep;
  buttonDepartamentNumber.textContent = depNum;
  buttonDepartamentNumber.style.backgroundColor = element.match
    ? FIND_TEXT_BACKGROUND_COLOR
    : DEFAULT_TEXT_BACKGROUND_COLOR;
  newElement.appendChild(buttonDepartamentText);
  newElement.appendChild(buttonDepartamentNumber);

  return newElement;
}

/**
 * Функция создания дочернего элемента
 * @param {*} element текущий элемент списка
 */

function createChildren(element, index) {
  const newElement = document.createElement("div");
  newElement.id = `children_wrapper_${element.parentElement.id}`;
  newElement.className = `childrens${element.open ? " open" : ""}`;
  newElement.style.marginLeft = `${(index + 1) * 8}px`;

  return newElement;
}

/**
 * Функция создания иконки для кнопки
 * @param {*} path Путь к иконке
 */

function createIcon(path) {
  const newElement = document.createElement("img");
  newElement.src = path;

  return newElement;
}

/**
 *
 * @param {*} data Элементы меню
 * @param {*} idElement ID элемента
 * @param {*} index Индекс элемента
 */
function addElements(data, idElement, index) {
  const wrapper = document.getElementById(idElement);
  for (let i = 0; i < data.length; i++) {
    // Обёртка
    const parentWrapper = createParentWrapper(
      data[i],
      `parent_wrapper`,
      PADDING_VALUE,
      index
    );
    // Кнопка пункта меню
    const parentButton = createMenuButton(`toggle_button`);
    // Текст для кнопки
    const buttonTextWrapper = createButtonText(data[i]);
    parentButton.appendChild(buttonTextWrapper);
    // Кладём кнопку в родителя
    parentWrapper.appendChild(parentButton);
    // Кладём родителя в обёртку
    wrapper.appendChild(parentWrapper);

    if (data[i].childrens) {
      // Обёртка дочерних эелементов
      const childrensWrapper = createChildren(data[i], i);
      parentWrapper.appendChild(childrensWrapper);
      // Иконка кнопки
      const buttonImage = createIcon("./assets/arrow-chevron-down.svg");
      // Кладём иконку в кнопку
      parentButton.prepend(buttonImage);
      parentButton.addEventListener("click", (e) => {
        e.stopPropagation();
        data[i].open = !data[i].open;
        data[i].open
          ? childrensWrapper.classList.add("open")
          : childrensWrapper.classList.remove("open");
      });

      addElements(data[i].childrens, childrensWrapper.id, i);
    }
  }
}
