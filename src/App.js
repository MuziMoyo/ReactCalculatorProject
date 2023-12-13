import React, { useReducer } from 'react';
import './styles.css';

const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }

      // Prevent more than one zero at the beginning
      if (payload.digit === '0' && state.currentOperand === '0') {
        return state;
      }

      // Prevent more than one period
      if (payload.digit === '.' && state.currentOperand.includes('.')) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      return {
        ...state,
        operation: payload.operation,
        previousOperand: state.currentOperand,
        currentOperand: '',
      };
    case ACTIONS.DELETE_DIGIT:
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.CLEAR:
      return {
        currentOperand: '',
        previousOperand: null,
        operation: null,
      };
    case ACTIONS.EVALUATE:
      const prev = parseFloat(state.previousOperand);
      const current = parseFloat(state.currentOperand);

      if (isNaN(prev) || isNaN(current) || !state.operation) {
        return state;
      }

      let result;
      switch (state.operation) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '*':
          result = prev * current;
          break;
        case '/':
          result = prev / current;
          break;
        default:
          return state;
      }

      return {
        currentOperand: result.toString(),
        previousOperand: null,
        operation: null,
      };
    default:
      return state;
  }
}
//formatting integers
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function Calculator() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {
    currentOperand: '',
    previousOperand: null,
    operation: null,
  });

  const handleDigitClick = (digit) => {
    dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } });
  };

  const handleOperationClick = (operation) => {
    dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } });
  };

  const handleDeleteClick = () => {
    dispatch({ type: ACTIONS.DELETE_DIGIT });
  };

  const handleClearClick = () => {
    dispatch({ type: ACTIONS.CLEAR });
  };

  const handleEvaluateClick = () => {
    dispatch({ type: ACTIONS.EVALUATE });
  };

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{previousOperand} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={handleClearClick}>
        AC
      </button>
      <button onClick={handleDeleteClick}>DEL</button>
      <button onClick={() => handleOperationClick('/')}>/</button>
      <button onClick={() => handleDigitClick('1')}>1</button>
      <button onClick={() => handleDigitClick('2')}>2</button>
      <button onClick={() => handleDigitClick('3')}>3</button>
      <button onClick={() => handleOperationClick('*')}>*</button>
      <button onClick={() => handleDigitClick('4')}>4</button>
      <button onClick={() => handleDigitClick('5')}>5</button>
      <button onClick={() => handleDigitClick('6')}>6</button>
      <button onClick={() => handleOperationClick('+')}>+</button>
      <button onClick={() => handleDigitClick('7')}>7</button>
      <button onClick={() => handleDigitClick('8')}>8</button>
      <button onClick={() => handleDigitClick('9')}>9</button>
      <button onClick={() => handleOperationClick('-')}>-</button>
      <button onClick={() => handleDigitClick('.')}>.</button>
      <button onClick={() => handleDigitClick('0')}>0</button>
      <button className="span-two" onClick={handleEvaluateClick}>=</button>
    </div>
  );
}

export default Calculator;
