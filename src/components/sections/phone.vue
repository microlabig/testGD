<template lang="pug">
    section.phone
      .container
        form.form.form--phone            
          .form__wrapper    
            formControllPhone

            .form__match-table
              .contacts__table
                ul.contacts__list
                  li(
                    v-for="contact in 11"
                    :key="contact"
                  ).contacts__item
                    .contacts__row
                      .contacts__avatar
                        .contacts__avatar-box
                          img(alt="Avatar" src="../../images/avatars/contact.jpg").contacts__image
                      .contacts__description
                        .contacts__name Giacomo Auilizzoni
                        .contacts__number +78121234567
                      .contacts__information
                        .contacts__information-box
            .form__row
              label.form__element
                input(type="text" placeholder="Please type a number...").form__input.phonenumber
              label.form__element.form__element--button.backspace
                button(type="button").form__button

            horizontalLine  
            
            numpad

            controllPhoneBig
</template>

<script>
    import formControllPhone from "../parts/formControllPhone";
    import controllPhoneBig from "../parts/controllPhoneBig";
    import horizontalLine from "../parts/horizontalLine";
    import numpad from "../parts/numpad";

    export default {
        components: {
            formControllPhone,
            controllPhoneBig,
            horizontalLine,
            numpad
        }
    }
</script>
