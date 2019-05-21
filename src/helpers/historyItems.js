export const transformHistoryItems = arr => {
    //if (arr.length === 0) return;
    arr.forEach( item => {   
        if (item.outgoing) { // если существует поле outgoing
          if (item.outgoing.length > 0) { // и оно не нулевое
            const MonthArrayStr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
                  currDateTime = new Date(); // текущая дата и время 
            // проверка на валидность dateTime
            //console.log(item, item.callDateTimeQuantity, item.name);            
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
                
                item.additionalInformation = [];
                item.additionalInformation[0] = 'Today';
                item.additionalInformation[1] = 'at '+ hoursStr + ':' + minutesStr + timeFormat;           
              } else {
                const monthStr = callDateTime.getMonth();
                item.additionalInformation = [];
                item.additionalInformation[0] = callDateTime.getDate() + ' of ' + MonthArrayStr[monthStr];
                item.additionalInformation[1] = '' + callDateTime.getFullYear(); // год
              }
            }      
          }  
        }
      });
      return arr;
};