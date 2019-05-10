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
            pre {{users}}
            contacts(
                v-if="showBaseWrapper && showBaseContacts" 
                @showContactInfo="showContactInfo"               
            )   
            history(
                v-if="showBaseWrapper && showBaseHistory"
            )      
            controll(
                @showPhone="showPhone"
            )
        contactData(
            v-else-if="!showBaseWrapper && showContactData"
            @showBaseWrapper="showBaseWrapperData"
            @showPhone="showContactPhone"
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

                users: []
            }
        },
        created() {            
            this.fetchUsers().then(data => this.users = [...data]);                       
        },
        methods: {
            ...mapActions('users', ['fetchUsers']),
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
            showContactInfo() {
                this.showBaseWrapper = false;                
                this.showContactData = true;
            },
            showContactPhone() {
                this.showContactData = false;
                this.modeShowPhone = 'contact';
                this.showPhoneWrapper = true;
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

