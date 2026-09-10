//связываем с элементами DOM
const angleInput = document.querySelector("#angle");
const lengthBInput = document.querySelector("#lengthB");
const lengthAInput = document.querySelector("#lengthA");
const stepAlongBInput = document.querySelector("#stepB");
const stepAlongAInput = document.querySelector("#stepA");
const resetBtn = document.querySelector("#resetBtn");
const statusDiv = document.querySelector("#status");
let stepBInput = document.querySelector("#step-b_l45-a");
let stepAInput = document.querySelector("#step-a_l45-b");
const spanB = document.querySelector("#span-b");
const spanA = document.querySelector("#span-a");
const stepNumber = document.querySelector("#num");
let stepB = document.querySelector("#stepB");
let stepA = document.querySelector("#stepA");
const mask = document.querySelector(".input-stepA-container");

const triangleInputs = [angleInput, lengthBInput, lengthAInput];
const stepInputs = [stepBInput, stepAInput];
let debounceTimer;

//обработчик события triangleInputs
triangleInputs.forEach(input => {
    input.addEventListener('input', () => {
        statusDiv.textContent = 'Печатает...';
        // Реализация Debouncing (задержка 1000мс)
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(calculateMissing, 1000);
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
    const alpha = angleInput.value ? parseFloat(angleInput.value) : null;
    const a = lengthAInput.value ? parseFloat(lengthAInput.value) : null;
    const b = lengthBInput.value ? parseFloat(lengthBInput.value) : null;

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

    //блокируем инпуты после успешного расчета
    lockTriangleInputs();

    //меняем местами шаги если угол больше 45 градусов
    if (angleInput.value > 45) {
        spanB.textContent = "a";
        spanA.textContent = "b";
        stepBInput = document.querySelector("#step-a_l45-b");
        stepAInput = document.querySelector("#step-b_l45-a");
        stepB = document.querySelector("#stepA");
        stepA = document.querySelector("#stepB"); 
    };
};

//функция блокировки triangleInputs
function lockTriangleInputs() {
    triangleInputs.forEach(input => input.disabled = true);
    statusDiv.textContent = "Расчет окончен. Укажите шаг";
};

//функция сброса
resetBtn.addEventListener('click', () => {
    triangleInputs.forEach(input => {
        input.value = '';
        input.disabled = false;
    });

    stepInputs.forEach(input => {
        input.value = '';
        input.disabled = false;
    });

    spanB.textContent = "b";
    spanA.textContent = "a";
    stepBInput = document.querySelector("#step-b_l45-a");
    stepAInput = document.querySelector("#step-a_l45-b");

    stepNumber.innerHTML = '';
    stepB.innerHTML = '';
    stepA.innerHTML = '';

    resetBtn.style.backgroundColor = '#F4FAFE';
    resetBtn.style.color = '#00A0E3';
    setTimeout(() => {
      resetBtn.style.backgroundColor = '#00A0E3';
      resetBtn.style.color = '#FFFFFF';
    }, 500);
    
    statusDiv.textContent = 'Ожидание ввода...';
});

//обработчик события stepInputs
stepInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (event.inputType !== 'deleteContentBackward') {
        statusDiv.textContent = 'Печатает...';
        // Реализация Debouncing (задержка 1000мс)
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(stepCalc, 1000);
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

    statusDiv.textContent = "Расчет окончен. Укажите шаг";
};

//Функция расчета шагов
function stepCalc () {
    //переводим значения в числа
    const b = stepBInput.value ? parseFloat(stepBInput.value) : null;
    const a = stepAInput.value ? parseFloat(stepAInput.value) : null;
    const alpha = angleInput.value ? parseFloat(angleInput.value) : null;

    //проверка на корректность математических данных
    if (b === 0 || a === 0) {
        statusDiv.textContent = 'Ошибка: шаг не может быть равен 0!';
        return;
    };

    //расчет шага в зависимости от того, какой шаг ввели
    if (a === null) {
        const rad = alpha * Math.PI / 180;
        stepAInput.value = stepBInput.value * Math.tan(rad);
        const count = lengthBInput.value / stepBInput.value;
        for (let i = 0; i < count; i++) {

            //добавляем номер шага
            const newNum = document.createElement("li");
            newNum.textContent = `${String(i+1).padStart(2, '0')}`;
            stepNumber.appendChild(newNum);

            //шаг b
            const nextStepB = document.createElement("li");
            nextStepB.textContent = `${(parseFloat(stepBInput.value) + i*parseFloat(stepBInput.value)).toFixed(2)}`;
            stepB.appendChild(nextStepB);

            //шаг a
            const nextStepA = document.createElement("li");
            nextStepA.textContent = `${(roundTo05(parseFloat(stepAInput.value) + i*parseFloat(stepAInput.value))).toFixed(2)}`;
            stepA.appendChild(nextStepA);
        };
        stepAInput.value = roundTo05(stepAInput.value).toFixed(2);
        stepBInput.value = roundTo05(stepBInput.value).toFixed(2);

    } else if (b === null){
        const rad = alpha * Math.PI / 180;
        stepBInput.value = stepAInput.value / Math.tan(rad);
        const count = lengthAInput.value / stepAInput.value;
        for (let i = 0; i < count; i++) {

            //добавляем номер шага
            const newNum = document.createElement("li");
            newNum.textContent = `${String(i+1).padStart(2, '0')}`;
            stepNumber.appendChild(newNum);

            //шаг b
            const nextStepB = document.createElement("li");
            nextStepB.textContent = `${(parseFloat(stepBInput.value) + i*parseFloat(stepBInput.value)).toFixed(2)}`;
            stepB.appendChild(nextStepB);

            //шаг a
            const nextStepA = document.createElement("li");
            nextStepA.textContent = `${(roundTo05(parseFloat(stepAInput.value) + i*parseFloat(stepAInput.value))).toFixed(2)}`;
            stepA.appendChild(nextStepA);
        };
        stepAInput.value = roundTo05(stepAInput.value).toFixed(2);
        stepBInput.value = roundTo05(stepBInput.value).toFixed(2);
    };

    //lockStepInputs();

    statusDiv.textContent = "Расчет окончен";
};

//функция округления до 0,05
function roundTo05(value) {
    return Math.round(value * 20) / 20;
};

//функция блокировки StepInputs
function lockStepInputs() {
    stepInputs.forEach(input => input.disabled = true);
};
