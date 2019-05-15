<template lang="pug">
    .app-wrapper
        .base-wrapper(
            v-if="showBaseWrapper"
        )
            navigation(
                @showHistory="showHistory"
                @showContacts="showContacts"
                :showBaseContacts="showBaseContacts"
                :showBaseHistory="showBaseHistory"
            )  
            contacts(                
                v-if="showBaseWrapper && showBaseContacts"
                :usersSearching="usersSearching"                 
                @showContactInfo="showContactInfo"               
                @searchStrInputed="searchStrInputed"
            )   
            history(
                v-if="showBaseWrapper && showBaseHistory"
            )      
            controll(
                @showPhone="showPhone"
            )
        contactData(
            v-else-if="!showBaseWrapper && showContactData"
            :currentUser="currentUser"
            @showBaseWrapper="showBaseWrapperData"
            @showPhone="showContactPhone"
            @saveCurrentUser="saveCurrentUser"
        )
        phone(
            v-else-if="!showBaseWrapper && showPhoneWrapper"
            :phoneCurrentUser="phoneCurrentUser"
            @showBaseWrapper="showBaseWrapperData"
            @showContactInfo="showContactInfo"
            @saveNewUserData="saveNewUserData"
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

    import {mapActions} from 'vuex';
import { log } from 'util';


    export default {

        components: {
            navigation, contacts, history, controll, 
            contactData, 
            phone
        },

        data() {
            return {
                showBaseWrapper: true,
                showBaseContacts: true,
                showBaseHistory: false,
                showContactData: false,
                showPhoneWrapper: false,

                users: [], // список всех пользователей
                currentUser: {}, // текущий пользователь,
                phoneCurrentUser: "", // номер телефона текущего пользователя

                searchStr: ""
            }
        },

        created() {            
            this.fetchUsers().then(data => this.users = [...data]);       
        },        

        computed: {
            usersSearching() { // поиск в списке пользователей
                let tempUsers = [],
                    str = this.searchStr.toLowerCase(),
                    usersStr = '';

                this.sortArrayByName(this.users);  

                for (let i = 0; i < this.users.length; i++) {
                    usersStr = this.users[i].name.toLowerCase();
                    if (usersStr.indexOf(str) !== -1) {
                        tempUsers.push(this.users[i]);
                        continue;
                    }
                    usersStr = this.users[i].lastName.toLowerCase();
                    if (usersStr.indexOf(str) !== -1) {
                        tempUsers.push(this.users[i]);
                        continue;
                    }
                    usersStr = this.users[i].phoneNumber.toLowerCase();
                    if (usersStr.indexOf(str) !== -1) {
                        tempUsers.push(this.users[i]);
                        continue;
                    }
                }
                return tempUsers;
            },

            
            getMaxIdUsers() {
                let max = 0;
                if (this.users.length > 0)
                    this.users.forEach(user => max = user.id > max ? user.id : max);
                    
                return max;
            } 
        },

        methods: {

            ...mapActions('users', ['fetchUsers', 'saveCurrentEditedUser']),

            sortArrayByName(arr) {                
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
            },

            showHistory() {
                this.showBaseContacts = false;
                this.showBaseHistory = true;
            },
            showContacts() {
                this.showBaseContacts = true;
                this.showBaseHistory = false;
            },
            showPhone() {                       
                this.phoneCurrentUser = "";
                this.showBaseWrapper = false;
                this.showPhoneWrapper = true;
            },
            showBaseWrapperData() {
                this.showPhoneWrapper = false;
                this.showContactData = false;
                this.showBaseWrapper = true;
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

            saveCurrentUser(userEdited) {
                //TODO: валидация данных полей ввода
                this.currentUser = {
                    ...this.currentUser,
                    ...userEdited
                };   
                this.saveCurrentEditedUser(this.currentUser); 
                this.users = this.users.map(user => user.id === this.currentUser.id ? this.currentUser : user);
            },

            saveNewUserData(number) {                
                this.currentUser.phoneNumber = number;
                this.currentUser.id = this.getMaxIdUsers + 1;           

                this.showPhoneWrapper = false;             
                this.showContactData = true;                 
            },

            searchStrInputed(str) {
                this.searchStr = str;                               
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

