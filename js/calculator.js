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



function clearOutput() {
    firstValue = 0;
    secondValue = 0;
    modifyingFirstValue = true;
    modifiedSecondValue = false;
    selectedOperator = '';
    outputText.textContent = '0';
}

function addDecimalSignToOutput() {
    if(!outputText.textContent.match(/[.]/)) outputText.textContent += '.'; // Only adds if there isn't already a '.'
}

function removeLastCharFromOutput() {
    if(outputText.textContent !== 0)  outputText.textContent = outputText.textContent.slice(0, -1); // Removes last char
    if(outputText.textContent === '') outputText.textContent = '0';                                 // If nothing is left, add a '0'

    updateValues();
}

function addNumberToOutput(number) {
    if(outputText.textContent === '0') {
        outputText.textContent = number;
    } else if(selectedOperator !== '' && secondValue === 0) {
        outputText.textContent = number;
    } else {
        outputText.textContent += number;
    }
    updateValues();
}

function selectOperator(operator) {
    if(selectedOperator !== '' && modifiedSecondValue) {
        calculate();
        modifyingFirstValue = false;
        selectedOperator = operator;
    }
    
    if(selectedOperator !== operator) {
        selectedOperator = operator;
        modifyingFirstValue = false;
        console.log(operator);
    }
}

function calculate() {
    if(selectedOperator !== '' && modifiedSecondValue) {
        outputText.textContent = operate(firstValue, selectedOperator, secondValue);
        firstValue = outputText.textContent;
        secondValue = 0;
        modifyingFirstValue = true;
        modifiedSecondValue = false;
        selectedOperator = '';

        console.log(firstValue + ' ' + secondValue);
    }
}

function updateValues() {
    if(modifyingFirstValue) {
        firstValue = outputText.textContent;
    } else {
        secondValue = outputText.textContent;
        modifiedSecondValue = true;
    }
    console.log(firstValue + ' ' + secondValue);
}



const outputText = document.querySelector('.output');
const buttonClear = document.querySelector('#C');
const buttonDecimal = document.querySelector('#decimal');
const buttonBackspace = document.querySelector('#backspace');
const buttonNumbers = document.querySelectorAll('.number');
const buttonOperators = document.querySelectorAll('.operator');
const buttonEquals = document.querySelector('#equals');

let firstValue = 0;
let secondValue = 0;
let modifyingFirstValue = true;
let modifiedSecondValue = false;
let selectedOperator = '';

buttonClear.addEventListener('click', () => clearOutput());

buttonDecimal.addEventListener('click', () => addDecimalSignToOutput());

buttonBackspace.addEventListener('click', () => removeLastCharFromOutput());

buttonNumbers.forEach(number => {
    number.addEventListener('click', () => addNumberToOutput(number.textContent));
});

buttonOperators.forEach(operator => {
    operator.addEventListener('click', () => selectOperator(operator.textContent));
});

buttonEquals.addEventListener('click', () => calculate());