const groupMap = (tab, key, fun) => {
    let res = new Map();
    let tru = new Array();
    let fals = new Array();

    tab.forEach(el => {
        if(key(el) == true) {
            tru.push(fun(el));
        }
        else {
            fals.push(fun(el));
        }
        res.set(true, tru);
        res.set(false, fals); 
    });
    console.log(res);
    return res;
}

console.log(groupMap([3,2,4,4,3], n => n % 2 === 0, n => n + 1));