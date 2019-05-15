<template lang="pug">
    section.contactdata
      .container
        form.form            
          .form__wrapper    
            formControll(
              @showBaseWrapper="$emit('showBaseWrapper')"
              @saveUserData="$emit('saveCurrentUser', currentUserEdited)"
            )
            label.form__element
              .form__avatar
                img(
                  alt="Аватар" 
                  :src="`${currentUser.userpic}`"
                  @error="errorLoadingImage"
                ).form__avatar-img
            div(
              v-for="(item, index) in userData" 
              :key="item"
            ).form__element                     
              contactDataInput(                
                :ph="inputPlaceholder[index]"
                :item="item"
                :index="index"
                v-model="val"
                @input="customInput"
              )                       
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

export default {

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

        currentUserEdited: {
          id: this.currentUser.id,
          name: this.currentUser.name, 
          lastName: this.currentUser.lastName, 
          phoneNumber: this.currentUser.phoneNumber, 
          dateOfBirth: this.currentUser.dateOfBirth
        }
      }
    },

    methods: {
      customInput(value, index) {
        switch (index) {
          case 0:  // name  
            this.currentUserEdited.name = value;
            break;
          case 1:  // lastName  
            this.currentUserEdited.lastName = value;
            break;
          case 2:  // phoneNumber
            this.currentUserEdited.phoneNumber = value;
            break;
          case 3:  // dateOfBirth  
            this.currentUserEdited.dateOfBirth = value;
            break;
        }          
      },

      errorLoadingImage(e) {        
        e.target.src = "./images/contact.jpg";        
      }
    }
}

</script>
