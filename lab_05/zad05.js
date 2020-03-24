'use strict';

const fun1 = (n) => {
    console.log("fun1: " + (n+5));
    return (n+5);
};

const fun2 = (n) => {
    console.log("fun2: " + (5*n));
    return (5*n);
}

const cb = (fun, cb) => {
    setTimeout(() => {
        cb(fun(val));
    }, Math.random * 1000);
    console.log("callback: ");
}

var val = 0;

const poKolei = (n,funTab,cb) =>  {
    val = n;
    funTab.forEach(element => {
        console.log("n: " + val);
        cb(element, (value) => {
         val = value;
         console.log("fun: " + element  + ", value: " + value);
        });
    });
}

console.log(poKolei(2,[fun1,fun2],cb));