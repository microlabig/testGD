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
    import { sortArrayByName } from '../helpers/sort.js'; 

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
            let p = "+7 (994) 876-32-45"
            
        },

        computed: {
            ...mapGetters("users", ["getUsers"]),

            // поиск в списке пользователей
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

            // определение максимального индекса в массиве users
            getMaxIdUsers() {
                let max = 0;
                if (this.users.length > 0)
                    this.users.forEach(user => max = user.id > max ? user.id : max);                    
                return max;
            } 
        },

        methods: {
            ...mapActions('users', ['fetchUsers', 'saveCurrentEditedUser', 'addNewUser']),

            showHistory() {
                this.showBaseContacts = false;
                this.showBaseHistory = true;
            },

            showContacts() {
                this.showBaseContacts = true;
                this.showBaseHistory = false;
            },

            showPhone() {    
                this.is_FromBaseWrapper = false;
                this.phoneCurrentUser = "";
                this.showBaseWrapper = false;
                this.showPhoneWrapper = true;
            },

            // нажата кнопка "Назад" в информации о пользователе
            showBaseWrapperData(phoneNum) {
                // FIXME: переделать историю переходов
                this.showPhoneWrapper = false;
                this.showContactData = false;
                this.showBaseWrapper = true;
                /*                 
                if (this.is_FromBaseWrapper) { // если из главного компонента, то показать главный компонент
                    this.showPhoneWrapper = false;
                    this.showContactData = false;
                    this.showBaseWrapper = true;
                } else { // иначе показать компонент набора номера
                    this.showContactData = false;
                    this.showPhoneWrapper = true;
                    this.phoneCurrentUser = phoneNum;
                } */
            },

            showContactInfo(usr) {
                this.currentUser = usr;
                this.showBaseWrapper = false;                
                this.showContactData = true;                
            },

            showContactPhone() {
                this.phoneCurrentUser = this.currentUser.phoneNumber;
                this.showContactData = false;
                this.showPhoneWrapper = true;
            },

            // открытие секции contactData для сохранения нового пользователя
            saveNewUserData(number) { 
                this.currentUser = {};               
                this.currentUser.phoneNumber = number;
                this.currentUser.id = this.getMaxIdUsers + 1;           

                this.showPhoneWrapper = false;             
                this.showContactData = true;                                 
            },

            // сохранение нового пользователя или изменение существующего
            saveUser(userEdited) {
                let is_UserExistence = false;

                //TODO: валидация данных полей ввода
                this.currentUser = {
                    ...this.currentUser,
                    ...userEdited
                };                
                
                this.users = this.users.map(user => {
                    if (user.id === this.currentUser.id) {                        
                        is_UserExistence = true;
                        return this.currentUser;
                    } else return user;
                });
                
                if (!is_UserExistence) { // если пользователя нет в списке - создать нового пользователя
                    this.currentUser.id = this.getMaxIdUsers + 1;
                    this.users.push(this.currentUser);
                    this.addNewUser(this.currentUser);
                } else // иначе отредактировать текущего
                    this.saveCurrentEditedUser(this.currentUser);                 
                
                this.showBaseWrapperData();
                //TODO: уведомление, что контакт сохранен
            },
            
            // передача значения из input компонента searchComponent в searchStr
            searchStrInputed(str) {
                this.searchStr = str;                               
            },

            // сохраним историю звонков
            saveCallInHistory(number, id) {
                let is_ExistedUser = false;
                
                this.users.forEach(user => {
                    if (user.id === id && user.phoneNumber === number) {
                        // TODO: добавить время вызова
                        this.historyUsersCalls.push(user);
                        is_ExistedUser = true;                        
                    }                    
                });
                if (!is_ExistedUser) {
                    const user = {};
                    user.id = -1;
                    user.name="Unknown"
                    user.lastName="Unknown"
                    user.phoneNumber=number;
                    this.historyUsersCalls.push(user);
                }               
            },

            itemMoved(historyArray) {
                this.historyUsersCalls = [...historyArray];
            }
        }

    }
</script>

<style lang="postcss">
    .app-wrapper,
    .base-wrapper {
        height: 100%;
    }
</style>

