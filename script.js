'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} EUR`;
};

// const user = 'Steven Thomas Williams'; //stw username
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// calc Display In Out Interest Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, array) => {
      console.log(array);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// The FIND METHOD~~~~~~~
const firstWithdrawal = movements.find(mov => mov < 0); //find only returns the first element that satisfy condition, not a array!
console.log(movements);
console.log(firstWithdrawal);
console.log(accounts); // accounts= aray of objects!

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

for (const acc of accounts) {
  if (acc.owner !== 'Jessica Davis') {
    continue;
  } else {
    console.log(acc);
  }
}
//Update UI function
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};
//ImplementinG LOGIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Event handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // prevent FORM from SUBMITTING (RELOAD PAGE)
  e.preventDefault();
  console.log('LOGIN');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value // return UNDEFIND daca nu exista acel username account
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    // Display UI means set display:0; to APP element in MAIN element (nu apare nimic pe pagina, gol, de la default de 100;)
    containerApp.style.opacity = 100;
    //Clear unput fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //the PIN inpit looses its FOCUS, THE BLINKING LINE/TYPEING
    // Update UI
    updateUI(currentAccount);
  }
});

// Implementing TRANSFERS!!!!!!!!!!!!!!!
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doinh the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
  }
});

//  Request LOAN FROM bANK
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add the movement
    currentAccount.movements.push(amount);

    //  Update UI
    updateUI(currentAccount);

    // Clean  amount input field
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('Delete');

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // delete account
    accounts.splice(index, 1);
    //  hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// SOME and EVERY methods!!!!!!!!!!!!!!!!!!!!!!!!!

console.log(movements);
console.log(movements.includes(-130)); // true
const anyDeposit = movements.some(mov => mov > 0);
console.log(anyDeposit);

// Every METHOD
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ARRAYS METHODS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// FLAT and FLATMAP METHODS!!!!!!!!!!!!!!!!!!!

const arr = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(arr.flat());
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);
// const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);

// flat
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

// flatMap
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)

  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

// MORE WAYS OF CREATING AND FILLING arrays!!!!!!!!!!!!!!!!!!!

const x = new Array(7);
console.log(x);
// fill with 1 from 3 index to 5 index not included! as sclice method !!
x.fill(1, 3, 5);

const arr1 = [1, 2, 3, 4, 5, 6, 7];
arr1.fill(23, 2, 5);
console.log(arr1);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);
//  [1,1,1,1,1,1,1,1]
const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI1 = document.querySelectorAll('.movements__value');

  console.log(movementsUI1);
  const movementsUI2 = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI2);
  // const movementsUI2=[...document.querySelectorAll('.movements__value')] si dupa MAP SEPARAT
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////

// LECTURES

// SUMMARY: WHICH ARRAY METHOD TO USE??!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ARRAY METHODS PRACTICE!!!!!!!!!!!!!!!!!!!!!!!!
// ex 1
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, mov) => sum + mov, 0);
console.log(bankDepositSum);

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? /*count++*/ ++count : count), 0); //0, the old value,  nu 6
console.log(numDeposits1000);

//  PREFIXED  ++ operator
// let a = 10;
// console.log(a++); return the old value, 10 solutia cl(++a)=PREFIEX ++ OP return 11
// console.log(a); return 11

// ex 2 How many deposits are in the bank with at least 1000$?
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;
// console.log(numDeposits1000);

// ex 3.
// Create an objects which contains the sum od the deposits and the sum of the withdrawals
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

// 4. this is a  nice title=> This is a nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'but', 'or', 'on', 'in', 'with', 'and'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice tile'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
/////////////////////////////////////////////////
// SLICE METHOD !!!!!!!!!!!!!!!!!!!!!

// let arr = ['a', 'b', 'c', 'd', 'e'];

// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(1, -2));

//SPLICE METHOD !! SAME AS slice but mutate the original array!!!

// console.log(arr.splice(2)); //[c,d,e]
// console.log(arr.splice(-1));
// console.log(arr); // [a,b]!!!!
// console.log(arr.splice(1, 3));
// console.log(arr);
/*
//REVERSE
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse()); //[f,g,h,i,j]
console.log(arr2); //mutate the array!!!

//CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

//JOIN
console.log(letters.join('=')); // a=b=c=d=e=f=g=h=i=j
*/

// AT METHOD
// const arr = [23, 11, 64];
// console.log(arr.at(0));

//FOREACH METHOD !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! LOOPING ARRAYS
/*


// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}:You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}:You withdrew ${Math.abs(movement)}`);
  }
}

movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}:You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}:You withdrew ${Math.abs(mov)}`);
  }
});
*/
//FORECH on MAPS and SETS!!!!!!!!!!!!!!!!!!!!!
//map
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
console.log(currencies);
console.log(currencies.entries());

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});
//set
const currenciesUnique = new Set(['usd', 'gpd', 'usd', 'eur', 'eur']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});
*/
//MAP METHOD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;

//   //return 23 -toate 23 elementele
// });

const movementsUSD = movements.map(mov => mov * eurToUsd);
console.log(movements);
console.log(movementsUSD);
//sau cu for of

const movementsDescriptions = movements.map(
  (mov, i, array) =>
    `Movement ${i + 1}:You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

console.log(movementsDescriptions);
*/
/*


const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositsfor = [];
for (const mov of movements) {
  if (mov > 0) depositsfor.push(mov);
}
console.log(depositsfor);

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});
console.log(withdrawals);
*/
//accumulator=> snowball
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   return acc + cur;
//   console.log(`Iteration ${{ i }}: ${acc}`);
// }, 0);
// console.log(balance);

//REDUCE METHOD !!!!!!!!!!!!!!!!!!
//Add values
/*
const balance = movements.reduce((acc, cur) => acc + cur, 0);

console.log(balance);
//sau
let sum = 0;
for (const mov of movements) sum += mov;

console.log(sum);
*/
//Maximum value
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);

//longest name
// const flowers = ['lalea', 'garoafa', 'crocus', 'lily'];
// const longestName = flowers.reduce((previous, initial) =>
//   previous.length > initial.length ? previous : initial
// );
// console.log(longestName);

// S11 156. The  magic of chaining methods!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);

// SORTING ARRAYS!!!!!!!!!!!!!!
// Strings

const owners = ['Jonas', 'Zack', 'Adam', 'Arthur'];
console.log(owners.sort()); // de la a la z
// console.log(owners); MUTATE THE ORIGINAL ARRAY!!!

// Numbers
console.log(movements);
// console.log(movements.sort()); dont sonrt by number, ony by strings! transform first to strings

// movements.sort((a, b) => {}); passing a Compare cALLBACK F IN sort method

// return < 0 A, B KEEP ORDER!
//  return > 0 B, A SWITCH ORDER!!
// aSCENDING ORDER
// movements.sort((a, b) => {
//   if (a > b) return 1;  a-b pozitiv 1
//   if (b > a) return -1; a-b negativ -1
// });
movements.sort((a, b) => a - b);
console.log(movements);
// dESCENDING ORDER
movements.sort((a, b) => {
  if (a > b) return -1;
  if (b > a) return 1;
});
console.log(movements);
