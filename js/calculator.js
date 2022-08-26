const operator = (() => { // Operator module
    let currentOperator = '';
    let chainOperator = '';

    const getCurrentOperator = () => currentOperator;
    const getChainOperator = () => chainOperator;
    
    const updateChainOperator = () => {
        chainOperator = currentOperator;
    }

    const switchOperator = (operator) => {    
        if(currentOperator && modifiedSecondValue) { // Chained operators
            calculate();
            modifyingFirstValue = false;
            currentOperator = operator;
            updateCalculationText();
        }
        
        if(currentOperator !== operator) { // Update if a new operator is clicked
            currentOperator = operator;
            updateCalculationText();
            modifyingFirstValue = false;
        }
    }

    const operateEquals = (number1, number2) => _operate(number1, currentOperator, number2);

    const operateChain = (number1, number2) => _operate(number1, chainOperator, number2);
    
    const _operate = (number1, operator, number2) => {
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

    const resetCurrentOperator = () => {
        currentOperator = '';
    }
    
    const resetChainOperator = () => {
        chainOperator = '';
    }

    return {
        getCurrentOperator,
        getChainOperator,
        updateChainOperator,
        switchOperator,
        operateEquals,
        operateChain,
        resetCurrentOperator,
        resetChainOperator
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
        if(text === '') _outputText.textcontent = '0'; // The output should never be empty
        else            _outputText.textContent = text;
        _updateOutputTextFontSize();
    }

    const addDecimalSign = () => {
        if(!_outputText.textContent.match(/[.]/)) _outputText.textContent += '.'; // Only adds if there isn't already a '.'
    }

    const removeLastChar = () => {
        if(_outputText.textContent !== 0) display.setOutputText(_outputText.textContent.slice(0, -1)); // Removes last char
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

    const resetText = () => {
        setCalculationText('');
        setOutputText('0');
    }

    return {
        getCalculationText,
        getOutputText,
        setCalculationText,
        setOutputText,
        addDecimalSign,
        removeLastChar,
        resetText
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

        _buttonDecimal.addEventListener('click', () => display.addDecimalSign());

        _buttonInverse.addEventListener('click', () => {
            resetLastValues();
            inverseCurrentNumber();
        });

        _buttonBackspace.addEventListener('click', () => {
            display.removeLastChar();
            updateValues();
        });

        _buttonNumbers.forEach(number => {
            number.addEventListener('click', () => {
                resetLastValues();
                addNumberToOutput(number.textContent);
                updateValues();
            });
        });

        _buttonOperators.forEach(buttonOperator => {
            buttonOperator.addEventListener('click', () => {
                resetLastValues();
                operator.switchOperator(buttonOperator.textContent);
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
    if(operator.getCurrentOperator() !== '' && modifiedSecondValue) { // Normal calculation when operator and values have been chosen
        display.setOutputText(operator.operateEquals(firstValue, secondValue));
        
        lastCalculationValue = secondValue;
        operator.updateChainOperator();
        
        calculationUpdates();
    } else if(operator.getChainOperator() !== '') { // Repeated equal calculation
        display.setOutputText(operator.operateChain(firstValue, lastCalculationValue));
        
        calculationUpdates();
    }
}

function calculationUpdates() {
    updateCalculationText();
    
    firstValue = display.getOutputText();
    secondValue = 0;
    modifyingFirstValue = true;
    modifiedFirstValue = false;
    modifiedSecondValue = false;
    operator.resetCurrentOperator()
}

/* Changing output */
function addNumberToOutput(number) {
    if(display.getOutputText() === '0') {                        // Replaces a '0'
        display.setOutputText(number);
    } else if(!modifiedFirstValue && !modifiedSecondValue) {    // If the change is the first that happens, it will replace the text
        display.setOutputText(number);
    } else if(operator.getCurrentOperator() !== '' && secondValue === 0) {   // Replaces a reset secondValue when an operator has been chosen
        display.setOutputText(number);
    } else {                                                    // Will normally add a value
        display.setOutputText(display.getOutputText() + number);
    }
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
}

const updateCalculationText = () => {
    if(equalsPressed) {
        display.setCalculationText(`${firstValue} ${operator.getChainOperator()} ${lastCalculationValue} =`);
        equalsPressed = false;
    } else if(operator.getCurrentOperator() !== '' && modifiedSecondValue) {
        display.setCalculationText(`${firstValue} ${operator.getCurrentOperator()}`);
    } else {
        display.setCalculationText(`${firstValue} ${operator.getCurrentOperator()}`);
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
    lastCalculationValue = 0;
    operator.resetCurrentOperator();
    operator.resetChainOperator();
    display.resetText();
}

function resetLastValues() { // Resets saved values used in repeated equal calculations
    operator.resetChainOperator();
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

let lastCalculationValue = 0;       // Needed for repeated equal presses