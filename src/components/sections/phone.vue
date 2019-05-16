<template lang="pug">
    section(:class="{'disable': is_calling}").phone
      .container
        form.form.form--phone            
          .form__wrapper    
            formControllPhone(
                :inputIsEmpty="inputIsEmpty"
                :lengthUserSearching="lengthUserSearching"
                :is_calling="is_calling"
                @showBaseWrapper="$emit('showBaseWrapper')"
                @saveUserData="$emit('saveNewUserData',phoneNumber)"
            )
            matchTable(
                :class="{'hidden': inputIsEmpty || lengthUserSearching===0}"
                :userSearching="userSearching"
                @userChange="userChange"
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
              ).form__element.form__element--button.backspace
                button(
                    @click.prevent="deleteLastSymbolInPhoneNumber"
                    type="button"
                ).form__button
            horizontalLine              
            numpad(
                @numpadClicked="numpadClicked"
            )
            controllPhoneBig(
                :inputIsEmpty="inputIsEmpty"
                :is_calling="is_calling"
                :class="{'disable':inputIsEmpty}"
                @madeACall="madeACall()"
            )            
</template>

<script>
    import { mapGetters } from 'vuex';

    import formControllPhone from "../parts/formControllPhone";
    import controllPhoneBig from "../parts/controllPhoneBig";
    import matchTable from "../parts/matchTable";
    import horizontalLine from "../parts/horizontalLine";
    import numpad from "../parts/numpad";

    import { sortArrayByName } from '../../helpers/sort.js';

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
                phoneNumber: "", // строка с вводимым номером телефона
                is_calling: false, // произведен звонокб
                callTime: 5000, // время вызова
                contacts: "", // список всех контактов
                contactsId: -1
            }
        },

        created() {
            if (this.phoneCurrentUser !== undefined ) this.phoneNumber = this.phoneCurrentUser; 
            this.contacts = this.getUsers;         
        },

        computed: {

            ...mapGetters("users", ["getUsers"]),

            inputIsEmpty() {                                
                return (this.phoneNumber.length > 0) ? false : true;
            },

            userSearching() {
                let tempUsers = [],                    
                    str = this.phoneNumber.toLowerCase(),
                    usersStr = '';

                sortArrayByName(this.contacts);

                if (!this.inputIsEmpty) {
                    for (let i = 0; i < this.contacts.length; i++) {                    
                        usersStr = this.contacts[i].phoneNumber.toLowerCase();
                        if (usersStr.indexOf(str) !== -1) {
                            tempUsers.push(this.contacts[i]);
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
                if (!this.is_calling) {
                    let str = '';                
                    str = this.phoneNumber.substring(0, this.phoneNumber.length - 1);                
                    this.phoneNumber = str;
                }
            },

            numpadClicked(num) {
                if (!this.is_calling) this.phoneNumber += num;
            },

            userChange(userID) {
                this.contactsId = userID;
                this.contacts.forEach(contact => {
                    if (contact.id === userID) {
                        this.phoneNumber = contact.phoneNumber;
                        return;
                    }
                });                                
            },

            madeACall() {
                let users = this.getUsers;

                this.is_calling = true;

                setTimeout(()=> {
                    this.is_calling = false;
                }, this.callTime);                 

                this.$emit('saveCallInHistory', this.phoneNumber, this.contactsId);            
            }
        }
    }
</script>
