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
            return expression;
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



function lastCharOperator(expression) {
    return containsOperator(expression.slice(-1));
}

function containsOperator(expression) {
    return expression.match(/[+-/x%]/);
}

function removeLastChar(expression) {
    return expression.slice(0, -1);
}



function clear() {
    outputText.textContent = '0';
}



const outputText = document.querySelector('.output');
const buttonClear = document.querySelector('#C');
const buttonDecimal = document.querySelector('#decimal');
const buttonBackspace = document.querySelector('#backspace');
const buttonNumbers = document.querySelectorAll('.number');
const buttonOperators = document.querySelectorAll('.operator');
const buttonEquals = document.querySelector('#equals');

buttonClear.addEventListener('click', () => clear());

buttonDecimal.addEventListener('click', () => {
    if (!outputText.textContent.match('.')) outputText.textContent += '.';
});

buttonBackspace.addEventListener('click', () => {
    if(outputText.textContent !== 0) outputText.textContent = removeLastChar(outputText.textContent);
    if(outputText.textContent === '') outputText.textContent = '0';
});

buttonNumbers.forEach(number => {
    number.addEventListener('click', () => {
        if(outputText.textContent === '0') outputText.textContent = number.textContent;
        else outputText.textContent += number.textContent;
    });
});

buttonOperators.forEach(operator => {
    operator.addEventListener('click', () => {
        const text = outputText.textContent;

        if(lastCharOperator(text)) {
            outputText.textContent = removeLastChar(text) + operator.textContent;
        } else {
            if(containsOperator(text)) outputText.textContent = operate(text);
            outputText.textContent += operator.textContent;
        }
    });
});

buttonEquals.addEventListener('click', () => outputText.textContent = operate(outputText.textContent));