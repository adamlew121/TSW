const groupBy = (tab, key) => {
    let res = new Map();
    let tru = new Array();
    let fals = new Array();

    tab.forEach(el => {
        if(key(el) == true) {
            tru.push(el);
        }
        else {
            fals.push(el);
        }
        res.set(true, tru);
        res.set(false, fals); 
    });
    console.log(res);
    return res;
}

let x = 10;
var y = 10;

const nextZad = () => {
    if (true) {
        console.log(" true " + x + " " + y);
    }
    console.log( " pozniej " + x + " " + y);
}

console.log(groupBy([3,2,4,4,3], n => n % 2 === 0));
console.log(nextZad());