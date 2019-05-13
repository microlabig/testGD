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
                :users="users" 
                @showContactInfo="showContactInfo"               
            )   
            history(
                v-if="showBaseWrapper && showBaseHistory"
                :users="users"
                :historyCalls="historyCalls"
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
            :modeShowPhone="modeShowPhone"
            @showBaseWrapper="showBaseWrapperData"
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

                modeShowPhone: 'empty',

                users: [],
                currentUser: {},

                historyCalls: []
            }
        },
        created() {            
            this.fetchUsers().then(data => this.users = [...data]);                       
        },
        methods: {
            ...mapActions('users', ['fetchUsers', 'saveCurrentEditedUser']),
            showHistory() {
                this.showBaseContacts = false;
                this.showBaseHistory = true;
            },
            showContacts() {
                this.showBaseContacts = true;
                this.showBaseHistory = false;
            },
            showPhone() {                                
                this.showBaseWrapper = false;
                this.modeShowPhone = 'empty';
                this.showPhoneWrapper = true;
            },
            showBaseWrapperData() {
                this.showPhoneWrapper = false;
                this.showContactData = false;
                this.showBaseWrapper = true;
            },
            showContactInfo(usr) {
                this.showBaseWrapper = false;                
                this.showContactData = true;
                this.currentUser = usr;
            },
            showContactPhone() {
                this.showContactData = false;
                this.modeShowPhone = 'contact';
                this.showPhoneWrapper = true;
            },
            saveCurrentUser(userEdited) {
                this.currentUser = {
                    ...this.currentUser,
                    ...userEdited
                };   
                this.saveCurrentEditedUser(this.currentUser); 
                this.users = this.users.map(user => user.id === this.currentUser.id ? this.currentUser : user);
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

