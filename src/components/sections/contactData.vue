<template lang="pug">
    section.contactdata
      .container
        form.form            
          .form__wrapper    
            formControll(
              @showBaseWrapper="$emit('showBaseWrapper')"
            )
            label.form__element
              .form__avatar
                img(alt="Аватар" src="../../images/avatars/contact.jpg").form__avatar-img
            label.form__element
              input(type="text" placeholder="First name").form__input
            label.form__element
              input(type="text" placeholder="Last name").form__input
            label.form__element
              input(type="text" placeholder="Phone number").form__input
            label.form__element
              input(type="text" placeholder="Date of birth mm/dd/yyyy").form__input
            chartComponent
        controllPhone(
          @showPhone="$emit('showPhone')"
        )
</template>

<script>
import formControll from "../parts/formControll";
import chartComponent from "../parts/chart";
import controllPhone from "../parts/controllPhone";

export default {
    components: {
        formControll,
        chartComponent,
        controllPhone
    }
}
</script>
