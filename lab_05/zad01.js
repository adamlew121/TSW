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

console.log(groupBy([3,2,4,4,3], n => n % 2 === 0));