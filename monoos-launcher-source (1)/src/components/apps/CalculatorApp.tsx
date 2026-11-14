import React, { useState } from 'react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

  const inputDigit = (d: string) => {
    if (resetNext) {
      setDisplay(d === '.' ? '0.' : d);
      setResetNext(false);
      return;
    }
    if (d === '.' && display.includes('.')) return;
    setDisplay(display === '0' && d !== '.' ? d : display + d);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b === 0 ? 0 : a / b;
      default:
        return b;
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(display);
    if (prevValue !== null && operator && !resetNext) {
      const nextVal = calculate(prevValue, current, operator);
      setDisplay(String(Number(nextVal.toFixed(8))));
      setPrevValue(nextVal);
    } else {
      setPrevValue(current);
    }
    setOperator(op);
    setResetNext(true);
  };

  const handleEquals = () => {
    if (prevValue === null || !operator) return;
    const current = parseFloat(display);
    const result = calculate(prevValue, current, operator);
    setDisplay(String(Number(result.toFixed(8))));
    setPrevValue(null);
    setOperator(null);
    setResetNext(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setResetNext(false);
  };

  const rows = [
    ['AC', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const handlePress = (btn: string) => {
    if (btn === 'AC') return handleClear();
    if (btn === '±') return setDisplay(String(parseFloat(display) * -1));
    if (btn === '%') return setDisplay(String(parseFloat(display) / 100));
    if (btn === '=') return handleEquals();
    if (['+', '-', '×', '÷'].includes(btn)) return handleOperator(btn);
    inputDigit(btn);
  };

  return (
    <div className="flex flex-col h-full justify-end px-4 pb-5">
      {/* Readout */}
      <div className="mb-5 text-right px-2">
        <div className="h-5 text-xs font-mono-tabular text-zinc-500">
          {prevValue !== null && operator ? `${prevValue} ${operator}` : ''}
        </div>
        <div className="font-mono-tabular text-5xl font-semibold tracking-tight truncate mt-1">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="space-y-2.5">
        {rows.map((row, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-2.5">
            {row.map((btn) => {
              const isOp = ['÷', '×', '-', '+', '='].includes(btn);
              const isTop = ['AC', '±', '%'].includes(btn);
              const isZero = btn === '0';

              return (
                <button
                  key={btn}
                  type="button"
                  onClick={() => handlePress(btn)}
                  className={`h-14 rounded-2xl font-mono-tabular text-lg font-medium active:scale-92 transition-transform ${
                    isZero ? 'col-span-2 text-left pl-6' : ''
                  } ${
                    btn === '='
                      ? 'bg-[#D71921] text-white'
                      : isOp
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : isTop
                      ? 'bg-black/10 dark:bg-white/15'
                      : 'bg-black/5 dark:bg-white/8'
                  }`}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
