'use strict';

const fun1 = (n) => {
    console.log("fun1: " + (n+5));
    return (n+5);
};

const fun2 = (n) => {
    console.log("fun2: " + (5*n));
    return (5*n);
}

const cb = (n, fun, cb) => {
    setTimeout(() => {
        cb(fun(n));
    }, Math.random * 1000);
    console.log("callback: " + n);
}

const poKolei = (n,fun1,fun2,cb) =>  {
    cb(n, fun1, (value) => {
        console.log(value);
        let n = value;
        cb(n, fun2, (value) => {
            console.log(value);
            console.log("end");
        });
    });
}

console.log(poKolei(2,fun1,fun2,cb))