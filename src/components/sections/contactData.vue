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
                .form__input-error {{errorValidation[index]}}
            chartComponent(
              :outgoingCalls="currentUser.outgoing"
            )
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
  import { backTransformPhoneNumber } from '../../helpers/transform';

  export default {  
      // добавим примесь validators (валидации данных)
      mixins: [require('simple-vue-validator').mixin],

      validators: { // укажем какие объекты в data() мы хотим валидировать
        // имя пользователя
        'currentUserEdited.name'(value) {
          return Validator.value(value).required("The field must not be empty!");
        },
        // фамилия пользователя
        'currentUserEdited.lastName'(value) {
          return Validator.value(value).required("The field must not be empty!");
        },
        // номер телефона пользователя
        'currentUserEdited.phoneNumber'(value) {
          const patternPhoneNumber = /[(^\+\d*)]|[(^\d{1,4}$)]/g; 
          return Validator.value(value).required("The field must not be empty!").regex(patternPhoneNumber,'Number format must be, eg. +1 \(234\) 567-89-01-..., 1234, ...');
        },
        // дата рождения пользователя
        'currentUserEdited.dateOfBirth'(value) {
          const patternDate = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/([0-9]{4})$/gi; // mm/dd/yyyy
          return Validator.value(value).required("The field must not be empty!").regex(patternDate,'Date format must be mm/dd/yyyy and valid!');
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
          userData: [ // хранит в себе данные о текущем редактируемом пользователе
            this.currentUser.name, 
            this.currentUser.lastName, 
            this.currentUser.phoneNumber, 
            this.currentUser.dateOfBirth
          ],

          inputPlaceholder: [ // содержимое placeholder-ов в input-ах
            'First name', 'Last name', 'Phone number', 'Date of birth mm/dd/yyyy'
          ],
          ph: "", // placeholder
          val: "", // значение из custom input

          currentUserEdited: { // для сохранения измененных данных редактируемого пользователя пользователя 
            id: this.currentUser.id,
            name: this.currentUser.name || "", 
            lastName: this.currentUser.lastName || "", 
            phoneNumber: this.currentUser.phoneNumber || "", 
            dateOfBirth: this.currentUser.dateOfBirth || ""
          },

          errorValidation: [] // сообщение об ошибке валидации
        }
      },

      computed: {
        //------------------------------------------
        // возьмем все customInput'ы (для валидации)
        //------------------------------------------
        inputElemets() {
          return this.$refs['inputElemets'];
        }
      },

      created() {    
        for (let i=0; i< this.userData.length; i++) this.errorValidation[i] = "";
      },

      methods: {    
        //-------------------------------------------------------
        // соотношение индекса и значения для каждого customInput
        //-------------------------------------------------------        
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
              this.currentUserEdited.phoneNumber = backTransformPhoneNumber(value);
              break;
            case 3:  // dateOfBirth  
              this.currentUserEdited.dateOfBirth = value;
              break;
          }   
          if (this.inputElemets[index].classList.contains('is_not_validate'))
            this.inputElemets[index].classList.remove('is_not_validate'); 
        },

        //--------------------------------------
        // ошибка загрузки аватарки пользователя
        //--------------------------------------
        errorLoadingImage(e) {        
          e.target.src = defaultURLPicture;        
        },

        //-------------------------------
        // соханить данные о пользователе
        //-------------------------------
        async saveUserData() {
          const validationFieldsArr = ['currentUserEdited.name', 'currentUserEdited.lastName', 'currentUserEdited.phoneNumber', 'currentUserEdited.dateOfBirth']; // проверяемые поля
          let arr = []; // массив ошибок
          // "обнулим" весь массив ошибок
          for (let i=0; i< validationFieldsArr.length; i++) arr[i] = "";

          // разрешим добавление ошибки валидации только после того, как валидация пройдет
          await this.$validate().then( success => { 
            if (!success) { // в случае если не прошли валидацию
              // проверим валидацию по всем полям
              for (let i=0; i < validationFieldsArr.length; i++) {
                if ( this.validation.hasError(validationFieldsArr[i]) ) {
                  // навесим класс ошибки на input[i]
                  this.inputElemets[i].classList.add('is_not_validate');
                  // запишем ошибку в массив ошибок
                  arr[i] = this.validation.firstError(validationFieldsArr[i]);
                }
              }
              return;              
            }
            this.validation.reset();            
            this.$emit('saveCurrentUser', this.currentUserEdited); 
          });
          setTimeout(() => {
            this.errorValidation = [...arr];            
          }, 50); // для обновления информации об ошибках
        }
      }
  }

</script>
