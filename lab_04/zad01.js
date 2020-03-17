const telefon = (tab) => {

re =  new RegExp('([0-9],){8}[0-9]');
let numerT = "+48 ";
temp = ""
temp+= tab;
if(!re.test(temp)) throw new Error("Niepoprawny argument")
temp = temp.replace(/,/g,"")
numerT = numerT + temp.slice(0,3) + "-" + temp.slice(3,6) + "-" + temp.slice(6,9)

console.log(numerT)
return numerT
}

console.log(telefon([1,2,3,4,5,6,7,8,9]));