const operator = (() => { // Operator module
    const operate = (number1, number2, operator) => {
        switch(operator) {
            case '+':
                return _add(number1, number2);
            case '-':
                return _subtract(number1, number2);
            case 'x':
                return _multiply(number1, number2);
            case '/':
                return _divide(number1, number2);
            case '%':
                return _modulo(number1, number2);
            default:
                return 'ERROR: Wrong operator';
        }
    }

    const _add      = (number1, number2) => +number1 + +number2;
    const _subtract = (number1, number2) => +number1 - +number2;
    const _multiply = (number1, number2) => +number1 * +number2;
    const _divide   = (number1, number2) => +number1 / +number2;
    const _modulo   = (number1, number2) => +number1 % +number2;

    return {
        operate
    }
})();

/* Calculation */
function calculate() {
    if(selectedOperator !== '' && modifiedSecondValue) { // Normal calculation when operator and values have been chosen
        outputText.textContent = operator.operate(firstValue, selectedOperator, secondValue);
        
        lastCalculationValue = secondValue;
        lastCalculationOperator = selectedOperator;
        
        calculationUpdates();
    } else if(lastCalculationOperator !== '') { // Repeated equal calculation
        outputText.textContent = operator.operate(firstValue, lastCalculationOperator, lastCalculationValue);
        
        calculationUpdates();
    }

    console.log(firstValue + ' ' + secondValue + ' ' + lastCalculationOperator);
}

function calculationUpdates() {
    updateCalculationText();
    
    firstValue = outputText.textContent;
    secondValue = 0;
    modifyingFirstValue = true;
    modifiedFirstValue = false;
    modifiedSecondValue = false;
    selectedOperator = '';

    updateOutputTextFontSize();
}

function selectOperator(operator) {    
    if(selectedOperator !== '' && modifiedSecondValue) { // Chained operators
        calculate();
        modifyingFirstValue = false;
        selectedOperator = operator;
        updateCalculationText();
    }
    
    if(selectedOperator !== operator) { // Update if a new operator is clicked
        selectedOperator = operator;
        updateCalculationText();
        modifyingFirstValue = false;
        console.log(operator);
    }
}



/* Changing output */
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
}



/* Updates */
function updateValues() {
    if(modifyingFirstValue) {
        firstValue = outputText.textContent;
        modifiedFirstValue = true;
    } else {
        secondValue = outputText.textContent;
        modifiedSecondValue = true;
    }
    updateOutputTextFontSize();
    console.log(firstValue + ' ' + secondValue);
}

function updateCalculationText() {
    if(equalsPressed) {
        calculationText.textContent = `${firstValue} ${lastCalculationOperator} ${lastCalculationValue} =`
        equalsPressed = false;
    } else if(selectedOperator !== '' && modifiedSecondValue) {
        calculationText.textContent = `${firstValue} ${selectedOperator}`;
    } else {
        calculationText.textContent = `${firstValue} ${selectedOperator}`;
    }

    updateCalculationTextFontSize();
}

function inverseCurrentNumber() {
    if(modifyingFirstValue) {                                   // Modifying the first value
        if(!modifiedFirstValue && !modifiedSecondValue) {       // Clears calculationText if a calculated value is inversed
            calculationText.textContent = '';
        }

        firstValue = -firstValue;
        modifiedFirstValue = true;
        outputText.textContent = firstValue;
    } else if (!modifyingFirstValue && modifiedSecondValue){    // Modifying the second value, when the second value has been assigned
        secondValue = -secondValue;
        modifiedSecondValue = true;
        outputText.textContent = secondValue;
    } 

    resetLastValues();
}


/* Variable font sizes */
function updateOutputTextFontSize() { // Dynamically change font size to fit window
    const length = outputText.textContent.length;
    const fontSize = (50 * 12 / length) + 'px';
    outputText.style.fontSize = (length <= 12) ? '50px' : fontSize;
}

function updateCalculationTextFontSize() { // Dynamically change font size to fit window
    const length = calculationText.textContent.length;
    const fontSize = (18 * 33 / length) + 'px';
    calculationText.style.fontSize = (length <= 33) ? '18px' : fontSize;
}



/* Resets */
function resetAll() {
    firstValue = 0;
    secondValue = 0;
    modifyingFirstValue = true;
    modifiedSecondValue = false;
    equalsPressed = false;
    selectedOperator = '';
    lastCalculationValue = 0;
    lastCalculationOperator = '';
    calculationText.textContent = '';
    outputText.textContent = '0';
    updateOutputTextFontSize();
}

function resetLastValues() { // Resets saved values used in repeated equal calculations
    lastCalculationOperator = '';
    lastCalculationValue = 0;
    equalsPressed = false;
}



/* DOM constants */
const calculationText = document.querySelector('.calculation-text');
const outputText = document.querySelector('.output-text');
const buttonClear = document.querySelector('#C');
const buttonDecimal = document.querySelector('#decimal');
const buttonInverse = document.querySelector('#inverse');
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
let equalsPressed = false;
let selectedOperator = '';

let lastCalculationValue = 0;       // Needed for repeated equal presses
let lastCalculationOperator = '';



/* Event listeners */
buttonClear.addEventListener('click', () => resetAll());

buttonDecimal.addEventListener('click', () => addDecimalSignToOutput());

buttonInverse.addEventListener('click', () => {
    resetLastValues();
    inverseCurrentNumber();
});

buttonBackspace.addEventListener('click', () => removeLastCharFromOutput());

buttonNumbers.forEach(number => {
    number.addEventListener('click', () => {
        resetLastValues();
        addNumberToOutput(number.textContent);
    });
});

buttonOperators.forEach(operator => {
    operator.addEventListener('click', () => {
        resetLastValues();
        selectOperator(operator.textContent);
    });
});

buttonEquals.addEventListener('click', () => {
    equalsPressed = true;
    calculate();
});