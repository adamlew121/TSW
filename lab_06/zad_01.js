'use strict';

const fun1 = () => {
    console.log("fun1 wywolana");
    cb();
};

const fun2 = () => {
    console.log("fun2 wywolana");
    cb();
}

const fun3 = () => {
    console.log("fun3 wywolana");
    cb();
}

const fun4 = () => {
    console.log("fun4 wywolana");
    cb();
}

const fun5 = () => {
    console.log("fun5 wywolana");
    cb();
}


const fcb = () => {
    console.log("fcb wywolana")
}

const cb = (fun, cb) => {
    setTimeout(() => {
    }, Math.random * 1000);
}


const poKolei = (funTab,fcb) =>  {
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
console.log(poKolei([fun1,fun2,fun3,fun4,fun5],fcb));