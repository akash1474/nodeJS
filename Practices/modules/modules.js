//05-04-2020 Saturday
// console.log(arguments);
// console.log(require('module').wrapper);

//module.exports
const C = require('./textmodule1');
const calc = new C();
console.log(calc.add(2, 5));

// const calc2 = require('./textmodule2');
// console.log(calc2.add(2, 5));
const { add, multiply, divide } = require('./textmodule2');
console.log(add(2, 5));

//Caching
require('./nodeJs/modules/textmodule3')(); //requireing and running at the same time
require('./nodeJs/modules/textmodule3')(); //module is loaded once                {from cache}
require('./nodeJs/modules/textmodule3')(); //                                     {form cache}
