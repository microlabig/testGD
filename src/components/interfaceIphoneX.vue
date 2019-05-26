<template lang="pug">
    .app-wrapper
        .base-wrapper(
            v-if="showBaseWrapper"
        )
            navigation(
                :showBaseContacts="showBaseContacts"
                :showBaseHistory="showBaseHistory"
                @showHistory="showHistory"
                @showContacts="showContacts"                
            ) 
            contacts(                
                v-if="showBaseWrapper && showBaseContacts"
                :usersSearching="usersSearching"                 
                @showContactInfo="showContactInfo"               
                @searchStrInputed="searchStrInputed"
            )   
            history(
                v-if="showBaseWrapper && showBaseHistory"
                :historyUsersCalls="historyUsersCalls"
                @itemMoved="itemMoved"
                @historyItemClicked="user => {this.showContactInfo(user)}"
            )      
            controll(
                @showPhone="showPhone"
            )
        contactData(
            v-else-if="!showBaseWrapper && showContactData"
            :currentUser="currentUser"
            @showBaseWrapper="showBaseWrapperData"
            @showPhone="showContactPhone"
            @saveCurrentUser="saveUser"
        )
        phone(
            v-else-if="!showBaseWrapper && showPhoneWrapper"
            :phoneCurrentUser="phoneCurrentUser"
            @showBaseWrapper="showBaseWrapperData"
            @showContactInfo="showContactInfo"
            @saveNewUserData="saveNewUserData"
            @saveCallInHistory="saveCallInHistory"
        )

</template>

<script>
    import contacts from "./sections/contacts";
    import history from "./sections/history";
    import contactData from "./sections/contactData";
    import phone from "./sections/phone";

    import navigation from "./parts/navigation";
    import controll from "./parts/controll";
    import controllPhoneBig from "./parts/controllPhoneBig";

    import { mapActions, mapGetters } from 'vuex';
    import { sortArrayByName, sortArrayByCallDateTime } from '../helpers/sort';     
    import { transformHistoryItems } from '../helpers/historyItems'; 

    export default {
        components: {
            navigation, contacts, history, controll, 
            contactData, 
            phone
        },

        data() {
            return {
                showBaseWrapper: true, // показывать основную секцию base-wrapper
                showBaseContacts: true, // показывать в base-wrapper компонент contacts
                showBaseHistory: false, // показывать в base-wrapper компонент history
                showContactData: false, // показывать компонент contactData
                showPhoneWrapper: false, // показывать компонент phone

                users: [], // список всех пользователей
                currentUser: {}, // текущий пользователь,
                phoneCurrentUser: "", // номер телефона текущего пользователя

                searchStr: "", // строка поиска контактов
                is_FromBaseWrapper: true, // флаг, охначающий откуда пришли в информацию о пользователе
                historyUsersCalls: [] // массив истории звонков пользователям
            }
        },

        async created() {    
            await this.fetchUsers();  // прочитаем из JSON список контактов и запишем его в стор
            this.users = this.getUsers; // сохраним в users  

            // заполним массив историей всех вызовов
            let historyID = 0;
            this.users.forEach( item => {
                if (item.outgoing) // если в контакте есть поле outgoing (исходящие вызовы)
                    if (item.outgoing.length > 0) { // и оно не пустое
                        // заполним массив historyUsersCalls
                        item.outgoing.forEach( callObj => {
                            const contact = {...item}; // возьмем все поля из текущего пользователя
                            contact.historyID = historyID; // добавим поле historyID                            
                            contact.callDateTimeQuantity = callObj; // добавим поле времени вызова - callDateTime
                            this.historyUsersCalls.push(contact); // добавим сформированный контакт в историю всех вызовов
                            historyID++; // увеличим historyID 
                        });                        
                    }
            });
            // отсортируем по дате
            sortArrayByCallDateTime(this.historyUsersCalls);
        },

        computed: {
            // добавим computed-свойство getUsers для быстрого доступа к users из стора
            ...mapGetters("users", ["getUsers"]),

            //-----------------------------
            // поиск в списке пользователей
            //-----------------------------
            usersSearching() { 
                let tempUsers = [],
                    str = this.searchStr.toLowerCase(),
                    usersStr = '';                    
                // отсортируем по имени
                sortArrayByName(this.users); 
                // найдем совпадения
                for (let i = 0; i < this.users.length; i++) {
                    usersStr = this.users[i].name.toLowerCase(); // по имени
                    if (usersStr.indexOf(str) !== -1) {
                        tempUsers.push(this.users[i]);
                        continue;
                    }
                    usersStr = this.users[i].lastName.toLowerCase(); // по фамилии
                    if (usersStr.indexOf(str) !== -1) {
                        tempUsers.push(this.users[i]);
                        continue;
                    }
                    usersStr = this.users[i].phoneNumber.toLowerCase(); // по номеру телефона
                    if (usersStr.indexOf(str) !== -1) {
                        tempUsers.push(this.users[i]);
                        continue;
                    }
                }                  
                return tempUsers;
            },

            //--------------------------------------------------
            // определение максимального индекса в массиве users
            //--------------------------------------------------
            getMaxIdUsers() {
                let max = 0;
                if (this.users.length > 0)
                    this.users.forEach(user => max = user.id > max ? user.id : max);                    
                return max;
            } 
        },

        methods: {
            // добавим экшенов из стора
            ...mapActions('users', ['fetchUsers', 'saveCurrentEditedUser', 'addNewUser', 'refreshUserData']),

            //-----------------------------------
            // показать секцию с историей звонков
            //-----------------------------------
            showHistory() {
                this.showBaseContacts = false;
                this.showBaseHistory = true;
            },
            
            //-------------------------------------
            // показать секцию со списком контактов
            //-------------------------------------
            showContacts() {
                this.showBaseContacts = true;
                this.showBaseHistory = false;
            },
            
            //----------------
            // показать numpad
            //----------------
            showPhone() {    
                this.is_FromBaseWrapper = false;
                this.phoneCurrentUser = "";
                this.showBaseWrapper = false;
                this.showPhoneWrapper = true;
            },

            //-------------------------------------------------------------------------------------------------------
            // нажата кнопка "Назад" в информации о пользователе - возвратиться на главный экран со списком контактов
            //-------------------------------------------------------------------------------------------------------
            showBaseWrapperData(phoneNum) {
                this.showPhoneWrapper = false;
                this.showContactData = false;
                this.showBaseWrapper = true;
            },
            
            //-----------------------------------
            // показать информацию о пользователе
            //-----------------------------------
            showContactInfo(usr) {
                this.currentUser = usr;
                this.showBaseWrapper = false;                
                this.showContactData = true;                
            },
            
            //---------------------------------------------------------
            // показать телефон и передать в него текщий номер телефона
            //---------------------------------------------------------
            showContactPhone() {
                this.phoneCurrentUser = this.currentUser.phoneNumber;
                this.showContactData = false;
                this.showPhoneWrapper = true;
            },

            //---------------------------------------------------------------
            // открытие секции contactData для сохранения нового пользователя
            //---------------------------------------------------------------
            saveNewUserData(number) { 
                this.currentUser = {};               
                this.currentUser.phoneNumber = number;
                this.currentUser.id = this.getMaxIdUsers + 1;           
                // покажем основной экран со списком пользователей
                this.showPhoneWrapper = false;             
                this.showContactData = true;                                 
            },

            //-----------------------------------------------------------
            // сохранение нового пользователя или изменение существующего
            //-----------------------------------------------------------
            saveUser(userEdited) {
                let is_UserExistence = false;

                // передадим необходимые поля в currentUser
                this.currentUser = {
                    ...this.currentUser,
                    ...userEdited
                };                
                
                // проверим, есть ли текущий контакт в списке
                this.users = this.users.map(user => {
                    if (user.id === this.currentUser.id) {                        
                        is_UserExistence = true;
                        return this.currentUser;
                    } else return user;
                });
                
                // если пользователя нет в списке - создать нового пользователя
                if (!is_UserExistence) { 
                    this.currentUser.id = this.getMaxIdUsers + 1;
                    this.users.push(this.currentUser);
                    this.addNewUser(this.currentUser);
                } else // иначе отредактировать текущего
                    this.saveCurrentEditedUser(this.currentUser);                 
                
                this.showBaseWrapperData();
                //TODO: уведомление, что контакт сохранен
            },

            //------------------------------------------------------------------            
            // передача значения из input компонента searchComponent в searchStr
            //------------------------------------------------------------------            
            searchStrInputed(str) {
                this.searchStr = str;                               
            },

            //----------------------------------
            // сохраним звонок в историю звонков
            //----------------------------------
            saveCallInHistory(number, id) {
                let is_ExistedUser = false, // признак существования пользователя с такими же id и number
                    user = {}, 
                    currDate = new Date(), // текущая дата
                    currDateStr = "", 
                    monthStr = "", dayStr = "", hoursStr = "", minutesStr = "", secondsStr = "",
                    month = 0, day = 0, hours = 0, minutes = 0, seconds = 0;

                month = currDate.getMonth() + 1, // т.к. январь - 1, не 0!
                day = currDate.getDate(),
                hours = currDate.getHours(),
                minutes = currDate.getMinutes(),
                seconds = currDate.getSeconds();                    

                // сформируем двузначные значения
                monthStr = (month < 10) ? ("0" + month) : ("" + month);
                dayStr = (day < 10) ? ("0" + day) : ("" + day);
                hoursStr = (hours < 10) ? ("0" + hours) : ("" + hours);
                minutesStr = (minutes < 10) ? ("0" + minutes) : ("" + minutes);
                secondsStr = (seconds < 10) ? ("0" + seconds) : ("" + seconds);

                // сформируем текущую дату в наш общий формат для истории звонков
                currDateStr = "" + currDate.getFullYear() + "-" + monthStr + "-" + dayStr + "T" +
                              hoursStr + ":" + minutesStr + ":" + secondsStr;                            
                
                // поиск пользователя в списке 
                for (let i = 0; i < this.users.length; i++) {                    
                    const item = this.users[i];
                    user = {};
                    // если нашли пользователя с таким же id и номером телефона 
                    if (item.id === id && item.phoneNumber === number) { 

                        user = {...item}; 
                        if (!user.callDateTimeQuantity) user.callDateTimeQuantity = {}; // если не существует поля callDateTimeQuantity
                        user.callDateTimeQuantity.dateTime = currDateStr;     

                        if (item.outgoing) { // если существует поле outgoing
                            if (item.outgoing.length > 0) { // и оно не нулевое
                                let is_foundIncoming = false; // признак найденной ранее даты вызова
                               
                                // переберем массив исходящих вызовов на поиск одинаковой даты
                                for (let i = 0; i < item.outgoing.length; i++) {                                    
                                    const itemDate = new Date(item.outgoing[i].dateTime); // дата вызова ранее
                                    const itemDateStr = itemDate.toLocaleDateString(); 
                                    const currDateStr = currDate.toLocaleDateString(); // текущая дата вызова
                                    // сравним их, если равны                            
                                    if (itemDateStr === currDateStr) {                                        
                                        user.callDateTimeQuantity.quantity = parseInt(item.outgoing[i].quantity) + 1; // увеличить счетчик вызовов в этот день
                                        user.outgoing[i].quantity = user.callDateTimeQuantity.quantity;
                                        is_foundIncoming = true;
                                        break;
                                    }                                    
                                }
                                // если не нашли такой же даты в массиве исходящих вызовов outgoing равной текущей
                                if (!is_foundIncoming) { 
                                    user.callDateTimeQuantity.quantity = 1;
                                    user.outgoing.push(user.callDateTimeQuantity);
                                }

                            } else {
                                // если не нашли такой же даты в массиве исходящих вызовов outgoing равной текущей                               
                                user.callDateTimeQuantity.quantity = 1;
                                user.outgoing.push(user.callDateTimeQuantity);                                
                            }                            
                        } else {
                            // если нет поля outgoing
                            user.outgoing = [];
                            user.callDateTimeQuantity.quantity = 1;
                            user.outgoing.push(user.callDateTimeQuantity); 
                        }
                        // пометим, что пользователь существует
                        is_ExistedUser = true;
                        this.users[i].outgoing = user.outgoing;
                        // поправим в store тоже информацию
                        this.refreshUserData(this.users[i]);
                        break;                        
                    }
                }

                // если не существует пользователя 
                if (!is_ExistedUser) {                       
                    let is_found = false, // пользователь уже есть в истории вызовов
                        historyUserFounded = {}; // временная переменная для передачи данных пользователя
                        
                    // посмотрим, есть ли в истории вызовов такой же номер телефона как и текущий
                    for (let i = 0; i < this.historyUsersCalls.length; i++) {         
                        // если нашли пользователя сохраненного в списке контактов, идем мимо
                        if (this.historyUsersCalls[i].id !== -1) continue; 
                        // если нашли пользователя уже с таким же номером телефона
                        if (this.historyUsersCalls[i].phoneNumber === number) {
                            is_found = true;
                            historyUserFounded = this.historyUsersCalls[i]; // сохраним пользователя во временную переменную
                            break;
                        }
                    }
                    // если уже звонили по данному номеру, а пользователь не сохранен в списке контактов
                    user.id = -1; 
                    if (is_found) { 
                        let is_foundIncoming = false; // признак найденной ранее даты вызова
                        // скопируем содержимое найденного объекта historyUserFounded                        
                        user = {...historyUserFounded};                        
                        // переберем массив исходящих вызовов на поиск одинаковой даты
                        for (let i = 0; i < historyUserFounded.outgoing.length; i++) {                                    
                            const historyUserFoundedDate = new Date(historyUserFounded.outgoing[i].dateTime); // дата вызова ранее
                            const historyUserFoundedDateStr = historyUserFoundedDate.toLocaleDateString(); 
                            const currDateStr = currDate.toLocaleDateString(); // текущая дата вызова
                            // сравним их, если равны                            
                            if (historyUserFoundedDateStr === currDateStr) {                                        
                                user.callDateTimeQuantity.quantity = historyUserFounded.outgoing[i].quantity + 1; // увеличить счетчик вызовов в этот день
                                user.outgoing[i].quantity = user.callDateTimeQuantity.quantity;
                                is_foundIncoming = true;
                                break;
                            }                                    
                        } 
                        
                        // если не нашли такой же даты в массиве исходящих вызовов outgoing равной текущей
                        if (!is_foundIncoming) { 
                            user.callDateTimeQuantity.quantity = 1;
                            user.callDateTimeQuantity.dateTime = currDateStr; 
                            user.outgoing.push(user.callDateTimeQuantity);
                        }
                    } else {
                        // заполним данные о неизвестном пользователе (по-умолчанию)
                        user.name = "Unknown";
                        user.lastName = "Unknown";
                        user.phoneNumber = number;
                        user.dateOfBirth = "Unknown";
                        user.callDateTimeQuantity = {};
                        user.outgoing = [];
                        user.callDateTimeQuantity.quantity = 1;
                        user.callDateTimeQuantity.dateTime = currDateStr;
                        user.outgoing.push(user.callDateTimeQuantity); 
                    }  
                    user.historyID = this.historyUsersCalls.length + 1;   
                }               
                // запишем сформированный объект user в список вызовов
                this.historyUsersCalls.push(user);
                // добавим дополнительные поля для отображения в списке 
                this.historyUsersCalls = transformHistoryItems(this.historyUsersCalls);
                // отсортируем по дате                    
                sortArrayByCallDateTime(this.historyUsersCalls);
            },

            //---------------------------------------
            // перемещение элементов в секции history
            //---------------------------------------
            itemMoved(historyArray) {
                this.historyUsersCalls = [...historyArray];
            }
        }

    }
</script>

<style lang="postcss">
    .app-wrapper {
        height: 100%;
    }
    .base-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
</style>

