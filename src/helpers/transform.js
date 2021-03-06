const patternMultyplyOrHash = /[\*\#]/g;

// ----------------------------------------------------------------
// преобразование номера вида "+ABCDEFGHJIK" в "+A (BCD) EFG-HJ-IK"
// ----------------------------------------------------------------
export const transformPhoneNumber = (number) => {
    let str = number;

    if (str.match(patternMultyplyOrHash) === null) {
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
    }
    return str;
};

// -------------------------------------------------------------------------
// обратное преобразование номера вида "+A (BCD) EFG-HJ-IK" в "+ABCDEFGHJIK"
// -------------------------------------------------------------------------
export const backTransformPhoneNumber = (number) => {
    let str = number;            
    
    if (str.match(patternMultyplyOrHash) === null) {
        let tempArr = [];

        if (number.length>9 && number[0]==='+') tempArr.push(number[0]);        
        
        for (let i=0; i<number.length; i++) {
            if (isFinite(number[i]) && number[i] !== " ") tempArr.push(number[i]);        
        }    

        str = tempArr.join('');
    }
    return str;
}

