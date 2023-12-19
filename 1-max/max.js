//  1, 3, 5, 7, 9 숫자를 한번씩 써서 만들 수 있는 두개의 숫자(예를들면 13, 579)중 곱한 값이 가장 큰 조합

const numbers = [1, 3, 5, 7, 9];

const findMax = () => {
  let firstNum = 0;
  let secondNum = 0;

  const calculate = (arr, idx) => {
    if (idx === arr.length) {
      const a = arr[0];
      const b = arr[1];
      const c = arr[2];
      const d = arr[3];
      const e = arr[4];

      const _firstNum = 10 * a + b;
      const _secondNum = 100 * c + 10 * d + e;

      if (_firstNum * _secondNum > firstNum * secondNum) {
        firstNum = _firstNum;
        secondNum = _secondNum;
      }
      return firstNum, secondNum;
    }

    for (let i = idx; i < arr.length; i++) {
      [arr[idx], arr[i]] = [arr[i], arr[idx]];
      calculate(arr, idx + 1);
      [arr[idx], arr[i]] = [arr[i], arr[idx]];
    }
  };

  calculate(numbers, 0);

  console.log(`최대 조합: ${firstNum}와 ${secondNum}의 곱`);
};

findMax();
