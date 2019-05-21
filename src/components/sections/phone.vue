<template lang="pug">
    section(:class="{'disable': is_calling}").phone
      .container
        form.form.form--phone            
          .form__wrapper    
            formControllPhone(
                :inputIsEmpty="inputIsEmpty"
                :is_calling="is_calling"
                :phoneNumberIsFounded="phoneNumberIsFounded"
                :is_ValidPhone="is_ValidPhone"
                @showBaseWrapper="$emit('showBaseWrapper')"
                @saveUserData="$emit('saveNewUserData',phoneNumber)"
            )
            matchTable(
                :class="{'hidden': inputIsEmpty || lengthUserSearching===0}"
                :userSearching="userSearching"
                @userChange="userChange"
            )
            phoneInput(                
                v-model="phoneNumber"
                :phoneNumber="phoneNumber"
                :inputIsEmpty="inputIsEmpty"
                @deleteLastSymbolInPhoneNumber="deleteLastSymbolInPhoneNumber"   
                @input="customInput"             
            )
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
    import phoneInput from "../parts/phoneInput";
    import horizontalLine from "../parts/horizontalLine";
    import numpad from "../parts/numpad";

    import { sortArrayByName } from '../../helpers/sort.js';
    import { transformPhoneNumber, backTransformPhoneNumber } from '../../helpers/transform';

    export default {

        components: {
            formControllPhone,
            controllPhoneBig,
            matchTable,
            phoneInput,
            horizontalLine,
            numpad
        },

        props: {
            phoneCurrentUser: String
        },

        data() {
            return {
                phoneNumber: "", // строка с вводимым номером телефона
                is_calling: false, // произведен звонок
                is_ValidPhone: false, 
                callTime: 1000, // время вызова
                contacts: "", // список всех контактов
                contactsId: -1 // ID текущего контакта
            }
        },

        created() {
            // если номер телефона определен (напр., на данный экран зашли через кнопку numpad из основного экрана)
            // то передать его в phoneNumber
            if (this.phoneCurrentUser !== undefined ) {
                this.phoneNumber = this.phoneCurrentUser; 
                this.is_ValidPhone = true;
            }
            // считаем список всех пользователей для поиска по номеру телефона            
            this.contacts = this.getUsers; 
            
        },

        computed: {

            ...mapGetters("users", ["getUsers"]),

            // определение пустого поля ввода номера телефона
            inputIsEmpty() {      
                return (this.phoneNumber.length > 0) ? false : true;
            },

            // поиск контактов по номеру телефона из поля ввода данного номера телефона
            userSearching() {
                let tempUsers = [],                    
                    str = this.phoneNumber,
                    usersStr = '';
                
                sortArrayByName(this.contacts);

                if (!this.inputIsEmpty) {
                    for (let i = 0; i < this.contacts.length; i++) {                    
                        usersStr = this.contacts[i].phoneNumber;
                        if (usersStr.indexOf(str) !== -1) {
                            tempUsers.push(this.contacts[i]);
                            continue;
                        }
                    }
                }
                return tempUsers;
            },

            // определение количества найденных контактов по номеру телефона
            lengthUserSearching() {
                return this.userSearching.length;
            },

            // если найден номер телефона
            phoneNumberIsFounded() {
                let f = false;
                this.contacts.forEach(contact => {
                    if (this.phoneNumber.length && contact.phoneNumber === this.phoneNumber) {
                        f = true;
                    }
                });
                return f;
            }  
        },

        methods: {

            // метод удаления последнего символа в поле ввода номера телефона
            deleteLastSymbolInPhoneNumber() {  
                if (!this.is_calling) {
                    let str = '';                
                    str = backTransformPhoneNumber(transformPhoneNumber(this.phoneNumber.substring(0, this.phoneNumber.length - 1)));                
                    this.phoneNumber = str;                    
                }
            },
            
            // обработка клика по цифровой клавиатуре
            numpadClicked(num) {
                if (!this.is_calling) this.phoneNumber += num;
            },

            // обработка клика по пользователю из списка в таблице совпадений и запоминание его ID и phoneNumber
            userChange(userID) {                
                this.contactsId = userID;
                this.contacts.forEach(contact => {
                    if (contact.id === userID) {
                        this.phoneNumber = contact.phoneNumber;
                        return;
                    }
                });                                
            },

            // совершение звонка
            madeACall() {
                let users = this.getUsers;

                this.is_calling = true;

                setTimeout(()=> {
                    this.is_calling = false;
                }, this.callTime);
                
                // определим есть ли пользователь с номером phoneNumber
                for (let i=0; i<users.length; i++) {                    
                    if (this.phoneNumber === users[i].phoneNumber) { // если есть, сохранить его ID
                        this.contactsId = users[i].id;
                        break;
                    }
                }
                
                // передадим в историю вызовов
                this.$emit('saveCallInHistory', this.phoneNumber, this.contactsId);            
            },

            // обработка данных на customInput 
            customInput(val) {
                const patternMultyplyOrHash = /[\*\#]/g;
                if (this.phoneNumber !== "") 
                    if (this.phoneNumber.match(patternMultyplyOrHash) !== null) 
                        this.is_ValidPhone = false;
                    else 
                        this.is_ValidPhone = true;

                this.phoneNumber = backTransformPhoneNumber(val);                
            }
        }
    }
</script>
