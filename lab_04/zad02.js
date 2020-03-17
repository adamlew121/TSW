function reverse(str) {
    str = str.split("");
    str = str.reverse();
    str = str.join("");
    return str;
}


const odwracanie = (napis) => {

    let slowa = napis.split(" ")
    console.log(slowa)
    var ret = slowa.map(function(x) {
        if(x.length > 4) {
            if(x.includes(",")) {
                if(x.length < 6) return x;
            }
            else {
                return reverse(x.substring(0, x.length - 1)) + ","
            }
            return reverse(x);
        }
        else {
            return x;
        }
    });
    var ret = ret.join(" ");
    console.log(ret);
    return ret;
}

console.log(odwracanie("Dzik jest dziki, dzik jest zły. Dzik ma bardzo ostre kły."))