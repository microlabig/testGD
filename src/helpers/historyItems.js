export const transformHistoryItems = arr => {
    //if (arr.length === 0) return;
    arr.forEach( item => {   
        const MonthArrayStr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
              currDateTime = new Date(); // текущая дата и время      
        // проверка на валидность dateTime
        const checkDate = Date.parse(item.callDateTimeQuantity.dateTime);                
        if (isFinite(checkDate)) { 
          // возъмем дату вызова контакта                  
          const callDateTime = new Date(item.callDateTimeQuantity.dateTime);        
          const callDateTimeStr = callDateTime.toLocaleDateString();
          // и текущую дату
          const localeDateStr = currDateTime.toLocaleDateString();
          
          // сравним обе даты
          // если равны, то покажем слово "Today" и время звонка
          // иначе - день, месяц, год звонка
          if (localeDateStr === callDateTimeStr) {
            let timeFormat = '', hoursStr = '', minutesStr = '';

            if (callDateTime.getHours() >= 0 && callDateTime.getHours() <=11) 
              timeFormat = 'AM';
            else 
              timeFormat = 'PM';
            if (callDateTime.getHours() === 0) {
              hoursStr = '0';
              timeFormat = 'AM';
            }
            else {
              if (callDateTime.getHours() >= 0 && callDateTime.getHours() <=11) {
                hoursStr = callDateTime.getHours();
                timeFormat = 'AM';
              } else {
                hoursStr = callDateTime.getHours() - 12;
                timeFormat = 'PM';
              }
            }
            minutesStr = callDateTime.getMinutes();            

            item.firstValue = 'Today';
            item.secondValue = 'at '+ hoursStr + ':' + minutesStr + timeFormat;           
          } else {
            const monthStr = callDateTime.getMonth();
            item.firstValue = callDateTime.getDate() + ' of ' + MonthArrayStr[monthStr];
            item.secondValue = '' + callDateTime.getFullYear(); // год
          }
        }        
      });
      return arr;
};