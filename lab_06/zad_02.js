'use strict';

const fun1 = () => {
    console.log("fun1 wywolana");
    cb();
};

const fun2 = () => {
    console.log("fun2 wywolana");
    cb("fun2");
}

const fun3 = () => {
    console.log("fun3 wywolana");
    cb();
}

const fun4 = () => {
    console.log("fun4 wywolana");
    cb("fun4");
}

const fun5 = () => {
    console.log("fun5 wywolana");
    cb("fun5");
}


const fcb = () => {
    console.log("lista: " + msgs);
    console.log("fcb wywolana")
}

const cb = (msg, cb) => {
    setTimeout(() => {
        msgs.push(msg);
    }, Math.random * 1000);
}

var msgs;

const poKolei2 = (funTab,fcb) =>  {
    while(true) {
        if(funTab.length > 0) {
            funTab[0]();
            funTab.splice(0,1);
        }
        else {
            fcb();
            break;
        }
    }


}
console.log(poKolei2([fun1,fun2,fun3,fun4,fun5],fcb));