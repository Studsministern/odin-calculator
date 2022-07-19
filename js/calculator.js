function operate(expression) {
    const numbers = expression.split(/[+-/x%]/);
    const operator = expression.replace(/[0-9]/g, '');
    switch(operator) {
        case '+':
            return add(numbers);
        case '-':
            return subtract(numbers);
        case 'x':
            return multiply(numbers);
        case '/':
            return divide(numbers);
        case '%':
            return modulu(numbers);
        default:
            return 'ERROR: Operator not found';
    }
}

function add(numberArray) {
    return +numberArray[0] + +numberArray[1];
}

function subtract(numberArray) {
    return +numberArray[0] - +numberArray[1];
}

function multiply(numberArray) {
    return +numberArray[0] * +numberArray[1];
}

function divide(numberArray) {
    if(numberArray[1] === 0) {
        return 'ERROR: Division by 0';
    }
    return +numberArray[0] / +numberArray[1];
}

function modulu(numberArray) {
    return +numberArray[0] % +numberArray[1];
}