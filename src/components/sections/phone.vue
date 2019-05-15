<template lang="pug">
    section.phone
      .container
        form.form.form--phone            
          .form__wrapper    
            formControllPhone(
                :inputIsEmpty="inputIsEmpty"
                :lengthUserSearching="lengthUserSearching"
                @showBaseWrapper="$emit('showBaseWrapper')"
                @saveUserData="$emit('saveNewUserData',phoneNumber)"
            )
            matchTable(
                :class="{'hidden': inputIsEmpty || lengthUserSearching===0}"
                :userSearching="userSearching"
                @showContactInfo="contact => $emit('showContactInfo', contact)"
            )
            .form__row
              label.form__element
                input(
                    type="text" 
                    placeholder="Please type a number..."
                    v-model="phoneNumber"
                ).form__input.phonenumber
              label(
                  :class="{'hidden': inputIsEmpty}"
                  @click.prevent="deleteLastSymbolInPhoneNumber"
              ).form__element.form__element--button.backspace
                button(type="button").form__button
            horizontalLine              
            numpad(
                @numpadClicked="numpadClicked"
            )
            controllPhoneBig(
                :inputIsEmpty="inputIsEmpty"
                :class="{'disable':inputIsEmpty}"
            )            
</template>

<script>
    import { mapGetters } from 'vuex';

    import formControllPhone from "../parts/formControllPhone";
    import controllPhoneBig from "../parts/controllPhoneBig";
    import matchTable from "../parts/matchTable";
    import horizontalLine from "../parts/horizontalLine";
    import numpad from "../parts/numpad";


    export default {

        components: {
            formControllPhone,
            controllPhoneBig,
            matchTable,
            horizontalLine,
            numpad
        },

        props: {
            phoneCurrentUser: String
        },

        data() {
            return {
                phoneNumber: ""
            }
        },

        created() {
            if (this.phoneCurrentUser !== undefined ) this.phoneNumber = this.phoneCurrentUser;            
        },

        computed: {

            ...mapGetters("users", ["getUsers"]),

            inputIsEmpty() {                                
                return (this.phoneNumber.length > 0) ? false : true;
            },

            userSearching() {
                let tempUsers = [],
                    users = this.getUsers,
                    str = this.phoneNumber.toLowerCase(),
                    usersStr = '';

                if (!this.inputIsEmpty) {
                    for (let i = 0; i < users.length; i++) {                    
                        usersStr = users[i].phoneNumber.toLowerCase();
                        if (usersStr.indexOf(str) !== -1) {
                            tempUsers.push(users[i]);
                            continue;
                        }
                    }
                }
                return tempUsers;
            },

            lengthUserSearching() {
                return this.userSearching.length;
            }
  
        },

        methods: {

            // метод удаления последнего символа в поле ввода номера телефона
            deleteLastSymbolInPhoneNumber() {                
                let str = '';                
                str = this.phoneNumber.substring(0, this.phoneNumber.length - 1);                
                this.phoneNumber = str;
            },

            numpadClicked(num) {
                this.phoneNumber += num;
            }
        }
    }
</script>
