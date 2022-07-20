/* Calculation functions */
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


/* Button press functions */
function clearOutput() {
    firstValue = 0;
    secondValue = 0;
    modifyingFirstValue = true;
    modifiedSecondValue = false;
    selectedOperator = '';
    lastCalculationValue = 0;
    lastCalculationOperator = '';
    outputText.textContent = '0';
    updateFontSize();
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
    if(outputText.textContent === '0') {                        // Replaces a '0'
        outputText.textContent = number;
    } else if(!modifiedFirstValue && !modifiedSecondValue) {    // If the change is the first that happens, it will replace the text
        outputText.textContent = number;
    } else if(selectedOperator !== '' && secondValue === 0) {   // Replaces a reset secondValue when an operator has been chosen
        outputText.textContent = number;
    } else {                                                    // Will normally add a value
        outputText.textContent += number;
    }
    updateValues();
    resetLastValues();
}

function selectOperator(operator) {    
    if(selectedOperator !== '' && modifiedSecondValue) { // Chained operators
        calculate();
        modifyingFirstValue = false;
        selectedOperator = operator;
    }
    
    if(selectedOperator !== operator) { // Update if a new operator is clicked
        selectedOperator = operator;
        modifyingFirstValue = false;
        console.log(operator);
    }

    resetLastValues();
}

function calculate() {
    if(selectedOperator !== '' && modifiedSecondValue) { // Normal calculation when operator and values have been chosen
        outputText.textContent = operate(firstValue, selectedOperator, secondValue);
        
        lastCalculationValue = secondValue;
        lastCalculationOperator = selectedOperator;
        
        calculationUpdates();
    } else if(lastCalculationOperator !== '') { // Repeated equal calculation
        outputText.textContent = operate(firstValue, lastCalculationOperator, lastCalculationValue);
        
        calculationUpdates();
    }

    console.log(firstValue + ' ' + secondValue + ' ' + lastCalculationOperator);
}

function calculationUpdates() {
    firstValue = outputText.textContent;
    secondValue = 0;
    modifyingFirstValue = true;
    modifiedFirstValue = false;
    modifiedSecondValue = false;
    selectedOperator = '';

    updateFontSize();
}

function resetLastValues() { // Resets saved values used in repeated equal calculations
    lastCalculationOperator = '';
    lastCalculationValue = 0;
}

function updateValues() {
    if(modifyingFirstValue) {
        firstValue = outputText.textContent;
        modifiedFirstValue = true;
    } else {
        secondValue = outputText.textContent;
        modifiedSecondValue = true;
    }
    updateFontSize();
    console.log(firstValue + ' ' + secondValue);
}

function updateFontSize() { // Dynamically change font size to fit window
    const length = outputText.textContent.length;
    const fontSize = (50 * 12 / length) + 'px';

    outputText.style.fontSize = (length <= 12) ? '50px' : fontSize;

    outputText.style.fontSize = outputText.textContent.length
}


/* DOM constants */
const outputText = document.querySelector('.output');
const buttonClear = document.querySelector('#C');
const buttonDecimal = document.querySelector('#decimal');
const buttonBackspace = document.querySelector('#backspace');
const buttonNumbers = document.querySelectorAll('.number');
const buttonOperators = document.querySelectorAll('.operator');
const buttonEquals = document.querySelector('#equals');

/* Variables */
let firstValue = 0;
let secondValue = 0;
let modifyingFirstValue = true;
let modifiedFirstValue = false;
let modifiedSecondValue = false;
let selectedOperator = '';

let lastCalculationValue = 0;       // Needed for repeated equal presses
let lastCalculationOperator = '';

/* Event listeners */
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