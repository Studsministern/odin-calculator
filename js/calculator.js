const operator = (() => { // Operator module
    let currentOperator = '';
    let chainOperator = '';

    const getCurrentOperator = () => currentOperator;
    const getChainOperator = () => chainOperator;
    
    const updateChainOperator = () => {
        chainOperator = currentOperator;
    }

    const switchOperator = (operator) => {    
        if(calculator.getModifiedSecondValue()) { // Chained operators
            calculator.calculate();
        }

        // Pressing the operator button will always assign a new operator, make sure the 
        // second value will be modified in the future, and changing the calculationText 
        // so it displays the first value and the currentOperator
        currentOperator = operator;
        calculator.setModifyingFirstValue(false);
        display.setCalculationText(`${calculator.getFirstValue()} ${currentOperator}`);
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

    const addNumber = (number) => {
        if(getOutputText() === '0') {                        // Replaces a '0'
            setOutputText(number);
        } else if(!calculator.getModifiedFirstValue() && !calculator.getModifiedSecondValue()) {    // If the change is the first that happens, it will replace the text
            setOutputText(number);
        } else if(operator.getCurrentOperator() !== '' && calculator.getSecondValue() === 0) {   // Replaces a reset secondValue when an operator has been chosen
            setOutputText(number);
        } else {                                                    // Will normally add a value
            setOutputText(getOutputText() + number);
        }
    }

    const addDecimalSign = () => {
        if(!getOutputText().match(/[.]/)) setOutputText(getOutputText() + '.'); // Only adds if there isn't already a '.'
    }

    const removeLastChar = () => {
        if(getOutputText() !== 0) setOutputText(getOutputText.slice(0, -1)); // Removes last char
    }

    const _updateCalculationTextFontSize = () => { // Dynamically change font size to fit window
        const length = getCalculationText().length;
        const fontSize = (18 * 33 / length) + 'px';
        _calculationText.style.fontSize = (length <= 33) ? '18px' : fontSize;
    }

    const _updateOutputTextFontSize = () => { // Dynamically change font size to fit window
        const length = getOutputText().length;
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
        addNumber,
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
        _buttonClear.addEventListener('click', () => calculator.resetAll());

        _buttonDecimal.addEventListener('click', () => display.addDecimalSign());

        _buttonInverse.addEventListener('click', () => {
            calculator.resetChainValues();
            calculator.inverseCurrentValue();
        });

        _buttonBackspace.addEventListener('click', () => {
            display.removeLastChar();
            calculator.updateValues();
        });

        _buttonNumbers.forEach(number => {
            number.addEventListener('click', () => {
                calculator.resetChainValues();
                display.addNumber(number.textContent);
                calculator.updateValues();
            });
        });

        _buttonOperators.forEach(buttonOperator => {
            buttonOperator.addEventListener('click', () => {
                calculator.resetChainValues();
                operator.switchOperator(buttonOperator.textContent);
            });
        });

        _buttonEquals.addEventListener('click', () => {
            calculator.calculate();
        });
    })();
})();

const calculator = (() => {
    let _firstValue = 0;
    let _secondValue = 0;
    let _modifyingFirstValue = true;
    let _modifiedFirstValue = false;
    let _modifiedSecondValue = false;
    let _chainValue = 0;       // Needed for repeated equal presses

    const getFirstValue          = () => _firstValue;
    const getSecondValue         = () => _secondValue;
    const getModifiedFirstValue  = () => _modifiedFirstValue;
    const getModifiedSecondValue = () => _modifiedSecondValue;

    const setModifyingFirstValue = (bool) => {
        _modifyingFirstValue = bool;
    }

    const calculate = () => {
        if(operator.getCurrentOperator() !== '' && _modifiedSecondValue) { // Normal calculation when operator and values have been chosen
            display.setOutputText(operator.operateEquals(_firstValue, _secondValue));
            
            _chainValue = _secondValue;
            operator.updateChainOperator();
            
            _calculationUpdates();
        } else if(operator.getChainOperator() !== '') { // Repeated equal calculation
            display.setOutputText(operator.operateChain(_firstValue, _chainValue));
            
            _calculationUpdates();
        }
    }

    const _calculationUpdates = () => {
        display.setCalculationText(`${_firstValue} ${operator.getChainOperator()} ${_chainValue} =`);
        
        _firstValue = display.getOutputText();
        _secondValue = 0;
        _modifyingFirstValue = true;
        _modifiedFirstValue = false;
        _modifiedSecondValue = false;
        operator.resetCurrentOperator()
    }

    const updateValues = () => {
        if(_modifyingFirstValue) {
            _firstValue = display.getOutputText();
            _modifiedFirstValue = true;
        } else {
            _secondValue = display.getOutputText();
            _modifiedSecondValue = true;
        }
    }

    const inverseCurrentValue = () => {
        if(_modifyingFirstValue) {                                   // Modifying the first value
            if(!_modifiedFirstValue && !_modifiedSecondValue) {       // Clears calculationText if a calculated value is inversed
                display.setCalculationText('');
            }
    
            _firstValue = -_firstValue;
            _modifiedFirstValue = true;
            display.setOutputText(_firstValue);
        } else if (!_modifyingFirstValue && _modifiedSecondValue){    // Modifying the second value, when the second value has been assigned
            _secondValue = -_secondValue;
            _modifiedSecondValue = true;
            display.setOutputText(_secondValue);
        } 
    
        calculator.resetChainValues();
    }

    const resetAll = () => {
        _firstValue = 0;
        _secondValue = 0;
        _modifyingFirstValue = true;
        _modifiedSecondValue = false;
        resetChainValues();
        operator.resetCurrentOperator();
        display.resetText();
    }

    const resetChainValues = () => { // Resets saved values used in repeated equal calculations
        _chainValue = 0;
        operator.resetChainOperator();
    }

    return {
        getFirstValue,
        getSecondValue,
        //getModifyingFirstValue,
        getModifiedFirstValue,
        getModifiedSecondValue,
        setModifyingFirstValue,
        //setModifiedFirstValue,
        //setModifiedSecondValue,
        calculate,
        updateValues,
        inverseCurrentValue,
        resetAll,
        resetChainValues
    }
})();