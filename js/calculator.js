function operate(number1, operator, number2) {
    switch(operator) {
        case '+':
            return add(number1, number2);
        case '-':
            return subtract(number1, number2);
        case 'x':
            return multiply(number1, number2);
        case '/':
            return divide(number1, number2);
        case '%':
            return modulu(number1, number2);
        default:
            return 'ERROR: Wrong operator';
    }
}

function add(number1, number2) {
    return +number1 + +number2;
}

function subtract(number1, number2) {
    return +number1 - +number2;
}

function multiply(number1, number2) {
    return +number1 * +number2;
}

function divide(number1, number2) {
    return +number1 / +number2;
}

function modulu(number1, number2) {
    return +number1 % +number2;
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