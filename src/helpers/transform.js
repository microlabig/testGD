// преобразование номера вида "+ABCDEFGHJIK" в "+A (BCD) EFG-HJ-IK"
export const transformPhoneNumber = (number) => {
    let str = number;
    if (number.length > 4) {
        let tempArr = [];

        let num = number.split('');

        if (num[0] !== "+") num.splice(0,0,'+'); // если нет вначале "+", то добавить его
        tempArr.push(num[0],num[1],' ','(');

        for (let i=2; i<5; i++) tempArr.push(num[i]);
        tempArr.push(')',' ');
        
        for (let i=5; i<8; i++) {
            if (num[i] !== undefined || num[i] !== null) 
                tempArr.push(num[i]);
        }

        for (let i=8; i<num.length; i++) {
            if (i%2 === 0) tempArr.push('-');
            if (num[i] !== undefined || num[i] !== null) 
                tempArr.push(num[i]);
        }

        str = tempArr.join('');        
    }
    return str;
};

// обратное преобразование номера вида "+A (BCD) EFG-HJ-IK" в "+ABCDEFGHJIK"
export const backTransformPhoneNumber = (number) => {
    const pattern = /[\+\d]/gim;

    if (number.length > 4) 
        return number.match(pattern).join('');
    
    return number;
};