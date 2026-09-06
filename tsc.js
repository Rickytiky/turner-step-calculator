//запрашиваем угол
let angle = prompt();
console.log(`angle: ${angle}`);

//запрашиваем желаемый шаг вдоль оси вращения
let stepAlongX = prompt();
console.log(`step along X axis: ${stepAlongX}`);
console.log(`-----------------------------------------------------`);

//вычисляем
function stepAlongY () {
    let result = Math.round(
        stepAlongX / Math.tan(angle * Math.PI / 180)
        * 1000) / 1000;
    let count = 5;
    for (let i = 0; i < count; i++)
    console.log(`step along X axis: ${Number(stepAlongX) + Number(i*stepAlongX)}         step along Y axis: ${Number(result) + Number(i*result)}`);
};

stepAlongY();