const operator = (() => { // Operator module
    const operate = (number1, operator, number2) => {
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

const display = (() => {
    const _calculationText = document.querySelector('.calculation-text');
    const _outputText = document.querySelector('.output-text');

    const getCalculationText = () => _calculationText.textContent;
    const getOutputText = () => _outputText.textContent;

    const setCalculationText = (text) => {
        _calculationText.textContent = text;
        _updateCalculationTextFontSize();
    }
    const setOutputText = (text) => {
        _outputText.textContent = text;
        _updateOutputTextFontSize();
    }

    const _updateCalculationTextFontSize = () => { // Dynamically change font size to fit window
        const length = _calculationText.textContent.length;
        const fontSize = (18 * 33 / length) + 'px';
        _calculationText.style.fontSize = (length <= 33) ? '18px' : fontSize;
    }

    const _updateOutputTextFontSize = () => { // Dynamically change font size to fit window
        const length = _outputText.textContent.length;
        const fontSize = (50 * 12 / length) + 'px';
        _outputText.style.fontSize = (length <= 12) ? '50px' : fontSize;
    }

    return {
        getCalculationText,
        getOutputText,
        setCalculationText,
        setOutputText
    }
})();

const buttons = (() => { // Button module
    const _buttonClear = document.querySelector('#C');
    const _buttonDecimal = document.querySelector('#decimal');
    const _buttonInverse = document.querySelector('#inverse');
    const _buttonBackspace = document.querySelector('#backspace');
    const _buttonNumbers = document.querySelectorAll('.number');
    const _buttonOperators = document.querySelectorAll('.operator');
    const _buttonEquals = document.querySelector('#equals');

    const _init = (() => {
        _buttonClear.addEventListener('click', () => resetAll());

        _buttonDecimal.addEventListener('click', () => addDecimalSignToOutput());

        _buttonInverse.addEventListener('click', () => {
            resetLastValues();
            inverseCurrentNumber();
        });

        _buttonBackspace.addEventListener('click', () => removeLastCharFromOutput());

        _buttonNumbers.forEach(number => {
            number.addEventListener('click', () => {
                resetLastValues();
                addNumberToOutput(number.textContent);
            });
        });

        _buttonOperators.forEach(operator => {
            operator.addEventListener('click', () => {
                resetLastValues();
                selectOperator(operator.textContent);
            });
        });

        _buttonEquals.addEventListener('click', () => {
            equalsPressed = true;
            calculate();
        });
    })();
})();

/* Calculation */
function calculate() {
    if(selectedOperator !== '' && modifiedSecondValue) { // Normal calculation when operator and values have been chosen
        display.setOutputText(operator.operate(firstValue, selectedOperator, secondValue));
        
        lastCalculationValue = secondValue;
        lastCalculationOperator = selectedOperator;
        
        calculationUpdates();
    } else if(lastCalculationOperator !== '') { // Repeated equal calculation
        display.setOutputText(operator.operate(firstValue, lastCalculationOperator, lastCalculationValue));
        
        calculationUpdates();
    }

    console.log(firstValue + ' ' + secondValue + ' ' + lastCalculationOperator);
}

function calculationUpdates() {
    updateCalculationText();
    
    firstValue = display.getOutputText();
    secondValue = 0;
    modifyingFirstValue = true;
    modifiedFirstValue = false;
    modifiedSecondValue = false;
    selectedOperator = '';
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
    if(!display.getOutputText().match(/[.]/)) display.setOutputText(display.getOutputText() + '.'); // Only adds if there isn't already a '.'
}

function removeLastCharFromOutput() {
    if(display.getOutputText() !== 0)  display.setOutputText(display.getOutputText().slice(0, -1)); // Removes last char
    if(display.getOutputText() === '') display.setOutputText('0');                                 // If nothing is left, add a '0'
    updateValues();
}

function addNumberToOutput(number) {
    if(display.getOutputText() === '0') {                        // Replaces a '0'
        display.setOutputText(number);
    } else if(!modifiedFirstValue && !modifiedSecondValue) {    // If the change is the first that happens, it will replace the text
        display.setOutputText(number);
    } else if(selectedOperator !== '' && secondValue === 0) {   // Replaces a reset secondValue when an operator has been chosen
        display.setOutputText(number);
    } else {                                                    // Will normally add a value
        display.setOutputText(display.getOutputText() + number);
    }
    updateValues();
}



/* Updates */
function updateValues() {
    if(modifyingFirstValue) {
        firstValue = display.getOutputText();
        modifiedFirstValue = true;
    } else {
        secondValue = display.getOutputText();
        modifiedSecondValue = true;
    }
    console.log(firstValue + ' ' + secondValue);
}

const updateCalculationText = () => {
    if(equalsPressed) {
        display.setCalculationText(`${firstValue} ${lastCalculationOperator} ${lastCalculationValue} =`);
        equalsPressed = false;
    } else if(selectedOperator !== '' && modifiedSecondValue) {
        display.setCalculationText(`${firstValue} ${selectedOperator}`);
    } else {
        display.setCalculationText(`${firstValue} ${selectedOperator}`);
    }
}

function inverseCurrentNumber() {
    if(modifyingFirstValue) {                                   // Modifying the first value
        if(!modifiedFirstValue && !modifiedSecondValue) {       // Clears calculationText if a calculated value is inversed
            display.setCalculationText('');
        }

        firstValue = -firstValue;
        modifiedFirstValue = true;
        display.setOutputText(firstValue);
    } else if (!modifyingFirstValue && modifiedSecondValue){    // Modifying the second value, when the second value has been assigned
        secondValue = -secondValue;
        modifiedSecondValue = true;
        display.setOutputText(secondValue);
    } 

    resetLastValues();
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
    display.setCalculationText('');
    display.setOutputText('0');
}

function resetLastValues() { // Resets saved values used in repeated equal calculations
    lastCalculationOperator = '';
    lastCalculationValue = 0;
    equalsPressed = false;
}

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