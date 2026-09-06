//запрашиваем угол
let angle = prompt("Insert angle");
console.log(`angle: ${angle}`);

//запрашиваем желаемый шаг перпендикулярно оси вращения
let stepAlongY = prompt("Insert step along Y axis");
console.log(`step along Y axis: ${stepAlongY}`);

//запрашиваем длину
let width = prompt("Insert widht");
console.log(`width: ${width}`);
console.log(`-----------------------------------------------------`);

//вычисляем шаг вдоль оси вращения
function stepAlongX () {
    let result = stepAlongY * Math.tan(angle * Math.PI / 180);
    let count = width / stepAlongY;
    for (let i = 0; i < count; i++)
    console.log(`step along Y axis: ${(Number(stepAlongY) + Number(i*stepAlongY)).toFixed(2)}         step along Y axis: ${(roundTo05(Number(result) + Number(i*result))).toFixed(2)}`);
};

//функция округления до 0,05
function roundTo05(value) {
    return Math.round(value * 20) / 20;
};

stepAlongX();