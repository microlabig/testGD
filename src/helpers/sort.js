// сортировка массива по имени
export const sortArrayByName = arr => {                
    if (arr.length>0) {
        arr.sort( (a,b) => { // сортируем список в алфавитном порядке (по имени и по возрастанию)
            let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) // сортируем по возрастанию
                return -1;
            if (nameA > nameB) 
                return 1;  
            return 0; // никакой сортировки
        });
    }
}

//TODO: сделать сортировку по кол-ву звонков и дате звонков