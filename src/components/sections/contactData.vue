<template lang="pug">
    section.contactdata
      .container
        form.form            
          .form__wrapper    
            formControll(
              @showBaseWrapper="$emit('showBaseWrapper',currentUser.phoneNumber)"
              @saveUserData="saveUserData"
            )
            .form__avatar-wrapper
              div.form__element
                .form__avatar
                  img(
                    alt="Аватар" 
                    :src="`${currentUser.userpic}`"
                    @error="errorLoadingImage"
                  ).form__avatar-img
            .form__inputs-wrapper
              div(
                v-for="(item, index) in userData" 
                :key="index"
                ref="inputElemets"
              ).form__element.form__element--data     
                contactDataInput(
                  :phone="currentUser.phoneNumber"
                  :ph="inputPlaceholder[index]"
                  :item="item"
                  :index="index"
                  v-model="val"
                  @input="customInput"
                )
                .form__input-error {{errorValidation}}
            chartComponent
        controllPhone(
          @showPhone="$emit('showPhone')"
        )
</template>

<script>

import formControll from "../parts/formControll";
import chartComponent from "../parts/chart";
import controllPhone from "../parts/controllPhone";
import contactDataInput from "../parts/contactDataInput";

import { Validator } from 'simple-vue-validator';

import { defaultURLPicture } from "../../helpers/urls";
import { backTransformPhoneNumber } from '../../helpers/transform.js';

export default {  
    mixins: [require('simple-vue-validator').mixin],

    validators: { // укажем какие объекты в data() мы хотим валидировать
      'currentUserEdited.name'(value) {
        return Validator.value(value).required("The field must not be empty!");
      },
      'currentUserEdited.lastName'(value) {
        return Validator.value(value).required("The field must not be empty!");
      },
      'currentUserEdited.phoneNumber'(value) {
        //const patternLastSymbol = /[a-zA-Z]?$|[а-яА-Я]?$|\W?$/g; 
        return Validator.value(value).required("The field must not be empty!");
      },
      'currentUserEdited.dateOfBirth'(value) {
        const patternDate = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/([0-9]{4})$/g; // mm/dd/yyyy
        return Validator.value(value).required("The field must not be empty!").regex(patternDate,'Date format must be valid mm/dd/yyyy');
      }
    },

    components: {
        formControll,
        chartComponent,
        controllPhone,
        contactDataInput
    },

    props: {
      currentUser: Object
    },

    data() {
      return {
        userData: [
          this.currentUser.name, 
          this.currentUser.lastName, 
          this.currentUser.phoneNumber, 
          this.currentUser.dateOfBirth
        ],

        inputPlaceholder: [
          'First name', 'Last name', 'Phone number', 'Date of birth mm/dd/yyyy'
        ],
        ph: "", // placeholder
        val: "", // значение из custom input

        currentUserEdited: { // для сохранения пользователя
          id: this.currentUser.id,
          name: this.currentUser.name || "", 
          lastName: this.currentUser.lastName || "", 
          phoneNumber: this.currentUser.phoneNumber || "", 
          dateOfBirth: this.currentUser.dateOfBirth || ""
        },

        errorValidation: "" // сообщение об ошибке валидации
      }
    },

    computed: {
      // возьмем все customInput'ы (для валидации)
      inputElemets() {
        return this.$refs['inputElemets']
      }
    },

    methods: {     
      /* 
      // форматируем номер телефона
      formatingPhoneNumber(number) {
          return transformPhoneNumber(number);
      }, */
        
      // соотношение индекса и значения для каждого customInput
      customInput(value, index) {        
        switch (index) {
          case 0:  // name              
            this.currentUserEdited.name = value;    
            break;
          case 1:  // lastName  
            this.currentUserEdited.lastName = value;
            break;
          case 2:  // phoneNumber   
            this.userData[2] = backTransformPhoneNumber(value);
            console.log(value);
            
            this.currentUserEdited.phoneNumber = backTransformPhoneNumber(value);
            break;
          case 3:  // dateOfBirth  
            this.currentUserEdited.dateOfBirth = value;
            break;
        }   
        if (this.inputElemets[index].classList.contains('is_not_validate'))
          this.inputElemets[index].classList.remove('is_not_validate'); 
      },

      errorLoadingImage(e) {        
        e.target.src = defaultURLPicture;        
      },

      async saveUserData() {
        let is_ValidateFields = false;

        // разрешим добавление ошибки валидации только после того, как валидация пройдет
        await this.$validate().then( success => { 
          if (!success) { // в случае если не прошли валидацию
            // проверим валидацию по полю name
            if ( this.validation.firstError('currentUserEdited.name') ) {
              this.inputElemets[0].classList.add('is_not_validate');
              this.errorValidation = this.validation.firstError('currentUserEdited.name');
            }
            // проверим валидацию по полю lastName
            if ( this.validation.firstError('currentUserEdited.lastName') ) {
              this.inputElemets[1].classList.add('is_not_validate');
              this.errorValidation = this.validation.firstError('currentUserEdited.lastName');
            }
            // проверим валидацию по полю phoneNumber
            if ( this.validation.firstError('currentUserEdited.phoneNumber') ) {
              this.inputElemets[2].classList.add('is_not_validate');
              this.errorValidation = this.validation.firstError('currentUserEdited.phoneNumber');
            }     
            // проверим валидацию по полю dateOfBirth
            if ( this.validation.firstError('currentUserEdited.dateOfBirth') ) {
              this.inputElemets[3].classList.add('is_not_validate');
              this.errorValidation = this.validation.firstError('currentUserEdited.dateOfBirth');
            }     
            return;              
          }
          is_ValidateFields = true;
          this.validation.reset();
        });
          
        if (!is_ValidateFields) return;
        
        this.$emit('saveCurrentUser', this.currentUserEdited);
      }
    }
}

</script>
