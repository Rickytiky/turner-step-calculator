//связываем с элементами DOM
const angleInput = document.querySelector("#angle");
const lengthBInput = document.querySelector("#lengthB");
const lengthAInput = document.querySelector("#lengthA");
const resetBtn = document.querySelector("#resetBtn");
const unoBtn = document.querySelector("#uno");
const statusDiv = document.querySelector("#status");
const stepNumber = document.querySelector("#num");
let stepBInput = document.querySelector("#step-b_l45-a");
let stepAInput = document.querySelector("#step-a_l45-b");
let spanB = document.querySelector("#span-b");
let spanA = document.querySelector("#span-a");
let stepB = document.querySelector("#stepB");
let stepA = document.querySelector("#stepA");

const triangleInputs = [angleInput, lengthBInput, lengthAInput];
const stepInputs = [stepBInput, stepAInput];
let debounceTimer;

let stepAInputFirst;
let stepBInputFirst;

stepBInput.style.borderColor = "#3BCCCA";
stepAInput.style.borderColor = "#00A0E3";

//выключены step и кнопка uno до того как будет произведен расчет
lockStepInputs();
unoBtn.disabled = true;

//обработчик события triangleInputs
triangleInputs.forEach(input => {
    input.addEventListener('blur', () => {
        statusDiv.textContent = 'Печатает...';
        calculateMissing ();
    });
});

//функция считающая недостающее значение тангенса при введении двух значений
function calculateMissing() {
    // Собираем заполненные инпуты
    const filledInputs = triangleInputs.filter(input => input.value.trim() !== '');

    //если заполнено меньше 2 полей, ничего не делаем
    if (filledInputs.length < 2) {
        statusDiv.textContent = 'Ожидание второго значения...';
        return;
    };

    //переводим значения в числа
    const alpha = angleInput.value ? parseInputToNumber(angleInput.value) : null;
    const a = lengthAInput.value ? parseInputToNumber(lengthAInput.value) : null;
    const b = lengthBInput.value ? parseInputToNumber(lengthBInput.value) : null;

    //проверка на корректность математических данных
    if (alpha !== null && (alpha % 180 === 90 || alpha % 180 === -90)) {
        statusDiv.textContent = 'Ошибка: Тангенс 90° не существует!';
        return;
    }
    if (b === 0) {
        statusDiv.textContent = 'Ошибка: Прилежащий катет не может быть равен 0!';
        return;
    };

    //расчет третьего значения в зависимости от того, что известно
    if (alpha === null) {
        //известны катеты -> Ищем угол
        const rad = Math.atan2(a, b);
        angleInput.value = (rad * 180 / Math.PI).toFixed(2);
    } else if (a === null) {
        //известен угол и прилежащий катет -> Ищем противолежащий
        const rad = alpha * Math.PI / 180;
        lengthAInput.value = (b * Math.tan(rad)).toFixed(2);
    } else if (b === null) {
        //известен угол и противолежащий катет -> Ищем прилежащий
        const rad = alpha * Math.PI / 180;
        if (Math.tan(rad) === 0) {
            statusDiv.textContent = 'Ошибка: Невозможно вычислить прилежащий катет при tan = 0';
            return;
        }
        lengthBInput.value = (a / Math.tan(rad)).toFixed(2);
    };

    //блокируем TriangleInputs после успешного расчета
    lockTriangleInputs();

    //разблокируем stepInputs после успешного расчета
    stepInputs.forEach(input => {
    input.value = '';
    input.disabled = false;
    });
};

//функция блокировки triangleInputs
function lockTriangleInputs() {
    triangleInputs.forEach(input => input.disabled = true);
    statusDiv.textContent = "Укажите шаг и снимите фокус поля ввода";
};

//функция блокировки stepInputs
function lockStepInputs() {
    stepInputs.forEach(input => input.disabled = true);
};

//функция сброса
resetBtn.addEventListener('click', () => {
    triangleInputs.forEach(input => {
        input.value = '';
        input.disabled = false;
    });

    stepInputs.forEach(input => {
        input.value = '';
        input.disabled = true;
    });

    unoBtn.disabled = true;

    stepBInput = document.querySelector("#step-b_l45-a");
    stepAInput = document.querySelector("#step-a_l45-b");
    spanB.textContent = "b";
    spanA.textContent = "a";
    stepB = document.querySelector("#stepB");
    stepA = document.querySelector("#stepA");

    stepBInput.style.borderColor = "#3BCCCA";
    stepAInput.style.borderColor = "#00A0E3";

    stepNumber.innerHTML = '';
    stepB.innerHTML = '';
    stepA.innerHTML = '';

    resetBtn.style.backgroundColor = '#00A0E3';
    resetBtn.style.color = '#00A0E3';
    setTimeout(() => {
      resetBtn.style.backgroundColor = '#3BCCCA';
      resetBtn.style.color = '#FFFFFF';
    }, 500);
    
    statusDiv.textContent = 'Ожидание ввода...';
});

//обработчик события stepInputs
stepInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (event.inputType !== 'deleteContentBackward') {
        statusDiv.textContent = 'Печатает...';
        // Реализация Debouncing (задержка 500мс)
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(stepCalc, 500);
        } else return;
    });
});

//обработчик события stepInputs для стирания
stepInputs.forEach(input => {
    input.addEventListener('input', (event) => {
    // Проверяем, было ли действие удалением символа назад (Backspace)
    if (event.inputType === 'deleteContentBackward') {
    clearStepInputs ();
    } else return;
    });
});

//функция очистки stepInputs
function clearStepInputs () {
    stepInputs.forEach(input => {
    input.value = '';
    });
    stepNumber.innerHTML = '';
    stepB.innerHTML = '';
    stepA.innerHTML = '';

    statusDiv.textContent = "Укажите шаг и снимите фокус поля ввода";
};

//Функция расчета шагов
function stepCalc () {
    // Собираем заполненные инпуты
    const filledInputs = stepInputs.filter(input => input.value.trim() !== '');

    //если заполнено меньше 1 поля, ничего не делаем
    if (filledInputs.length < 1) {
        statusDiv.textContent = "Укажите шаг и снимите фокус поля ввода";
        return;
    };

    //переводим значения в числа
    const b = stepBInput.value ? parseInputToNumber(stepBInput.value) : null;
    const a = stepAInput.value ? parseInputToNumber(stepAInput.value) : null;
    const alpha = angleInput.value ? parseInputToNumber(angleInput.value) : null;

    //проверка на корректность математических данных
    if (b === 0 || a === 0) {
        statusDiv.textContent = 'Ошибка: шаг не может быть равен 0!';
        return;
    };

    //расчет шага в зависимости от того, какой шаг ввели
    if (a === null) {
        const rad = alpha * Math.PI / 180;
        stepAInput.value = parseInputToNumber(stepBInput.value) * Math.tan(rad);
        const count = parseInputToNumber(lengthBInput.value) / parseInputToNumber(stepBInput.value);
        for (let i = 0; i < count; i++) {

            //добавляем номер шага
            const newNum = document.createElement("li");
            newNum.textContent = `${String(i+1).padStart(2, '0')}`;
            stepNumber.appendChild(newNum);

            //шаг b
            const nextStepB = document.createElement("li");
            nextStepB.textContent = `${(roundTo05(parseInputToNumber(stepBInput.value) + i*parseInputToNumber(stepBInput.value))).toFixed(2)}`;
            stepB.appendChild(nextStepB);

            //шаг a
            const nextStepA = document.createElement("li");
            nextStepA.textContent = `${(roundTo05(parseInputToNumber(stepAInput.value) + i*parseInputToNumber(stepAInput.value))).toFixed(2)}`;
            stepA.appendChild(nextStepA);
        };
        //сохраняем точные значения и округляем их для вывода на экран
        stepBInput.dataset.fullValue = stepBInput.value;
        stepAInput.dataset.fullValue = "";
        stepAInput.value = roundTo05(parseInputToNumber(stepAInput.value)).toFixed(2);
        stepBInput.value = roundTo05(parseInputToNumber(stepBInput.value)).toFixed(2);

        //записываем что был введен шаг b (для функции uno)
        stepBInputFirst = true;
        stepAInputFirst = false;
        unoBtn.disabled = false;

    } else if (b === null){
        const rad = alpha * Math.PI / 180;
        stepBInput.value = parseInputToNumber(stepAInput.value) / Math.tan(rad);
        const count = parseInputToNumber(lengthAInput.value) / parseInputToNumber(stepAInput.value);
        for (let i = 0; i < count; i++) {

            //добавляем номер шага
            const newNum = document.createElement("li");
            newNum.textContent = `${String(i+1).padStart(2, '0')}`;
            stepNumber.appendChild(newNum);

            //шаг b
            const nextStepB = document.createElement("li");
            nextStepB.textContent = `${(roundTo05(parseInputToNumber(stepBInput.value) + i*parseInputToNumber(stepBInput.value))).toFixed(2)}`;
            stepB.appendChild(nextStepB);

            //шаг a
            const nextStepA = document.createElement("li");
            nextStepA.textContent = `${(roundTo05(parseInputToNumber(stepAInput.value) + i*parseInputToNumber(stepAInput.value))).toFixed(2)}`;
            stepA.appendChild(nextStepA);
        };
        //сохраняем точные значения и округляем их для вывода на экран
        stepAInput.dataset.fullValue = stepAInput.value;
        stepBInput.dataset.fullValue = "";
        stepAInput.value = roundTo05(parseInputToNumber(stepAInput.value)).toFixed(2);
        stepBInput.value = roundTo05(parseInputToNumber(stepBInput.value)).toFixed(2);

        //записываем что был введен шаг a (для функции uno)
        stepAInputFirst = true;
        stepBInputFirst = false;
        unoBtn.disabled = false;
    };

    statusDiv.textContent = "Расчет окончен";
};

//функция смены stepInputs
function uno() {  
    clearStepInputs ();
    [stepAInput.dataset.fullValue, stepBInput.dataset.fullValue] = [stepBInput.dataset.fullValue, stepAInput.dataset.fullValue];
    stepAInput.value = stepAInput.dataset.fullValue;
    stepBInput.value = stepBInput.dataset.fullValue;
    [stepAInput, stepBInput] = [stepBInput, stepAInput];
    [stepAInput.style.borderColor, stepBInput.style.borderColor] = [stepBInput.style.borderColor, stepAInput.style.borderColor];
    [stepA, stepB] = [stepB, stepA];
    [spanA.textContent, spanB.textContent] = [spanB.textContent, spanA.textContent];
    stepCalc ();
};
        /*
            [stepAInput.dataset.fullValue, stepBInput.dataset.fullValue] = [stepBInput.dataset.fullValue, stepAInput.dataset.fullValue];
    stepAInput.value = stepAInput.dataset.fullValue;
    stepBInput.value = stepBInput.dataset.fullValue;
        
        spanB.textContent = "a";
        spanA.textContent = "b";
        stepBInput = document.querySelector("#step-a_l45-b");
        stepBInput.style.borderColor = "#3BCCCA";
        stepAInput = document.querySelector("#step-b_l45-a");
        stepAInput.style.borderColor = "#00A0E3";
        stepB = document.querySelector("#stepA");
        stepA = document.querySelector("#stepB"); */



//кнопка смены stepInputs
unoBtn.addEventListener('click', () => {
    uno();
});

//функция округления до 0,05
function roundTo05(value) {
    return Math.round(value * 20) / 20;
};

//функция перевода значения из инпутов в числа (безопасная в сравнении с eval)
function parseInputToNumber(inputValue) {
  // Убираем лишние пробелы
  const sanitized = inputValue.trim();

  // Если инпут пустой, возвращаем 0 или null
  if (!sanitized) return 0;

  try {
    // Безопасный аналог eval() через создание новой функции
    // Он выполнит математическое выражение и вернет результат
    const result = new Function(`return (${sanitized})`)();
    
    // Проверяем, что получилось именно число
    return typeof result === 'number' && !isNaN(result) ? result : 0;
  } catch (error) {
    // Если пользователь ввел некорректное выражение (например, "2 + привет")
    statusDiv.textContent = "Ошибка валидации выражения";
    return 0; 
  };
};