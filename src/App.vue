<template lang="pug">  
  .app-root

    //- .keypad
    //-   button(type="button").keypad__btn

    //- nav.menu
    //-   ul.menu__list
    //-     li.menu__item
    //-       a(href="#").menu__link.active Contacts
    //-     li.menu__item
    //-       a(href="#").menu__link History 

    //- section.contacts
    //-   .container
    //-     .search
    //-       input(type="text" placeholder="live search in names and phone").search__input
    //-     .horizontal-line
    //-       svg(viewBox="0 0 1000 100" preserveAspectRatio="none").horizontal-line__icon
    //-         ellipse(
    //-           cx="500" cy="50" rx="500" ry="8"
    //-           fill="#414c63"
    //-         )
    //-     .contacts__table
    //-       ul.contacts__list
    //-         li(
    //-           v-for="contact in 10"
    //-           :key="contact"
    //-         ).contacts__item
    //-           .contacts__row
    //-             .contacts__avatar
    //-               .contacts__avatar-box
    //-                 img(alt="Avatar" src="./images/avatars/contact.jpg").contacts__image
    //-             .contacts__description
    //-               .contacts__name Giacomo Auilizzoni
    //-               .contacts__number +78121234567
    //-             .contacts__information
    //-               .contacts__information-box            

    //- section.history
    //-   .container   
    //-     .contacts__table
    //-       ul.contacts__list
    //-         li(
    //-           v-for="contact in 10"
    //-           :key="contact"
    //-         ).contacts__item
    //-           .contacts__row
    //-             .contacts__hamburger
    //-               .contacts__hamburger-icon
    //-                 .contacts__hamburger-line(
    //-                   v-for="line in 3"
    //-                   :key="line"
    //-                 )
    //-             .contacts__description
    //-               .contacts__name Giacomo Auilizzoni
    //-               .contacts__number +78121234567
    //-             .contacts__date
    //-               .contacts__day Today
    //-               .contacts__year at 12:10PM            
              
    //- section.contactdata
    //-   .container
    //-     form.form            
    //-       .form__wrapper    
    //-         .form__controll        
    //-           label.form__element.form__element--button.back
    //-             button(type="button").form__button
    //-           label.form__element.form__element--button.save
    //-             button(type="button").form__button
    //-         label.form__element
    //-           .form__avatar
    //-             img(alt="Аватар" src="./images/avatars/contact.jpg").form__avatar-img
    //-         label.form__element
    //-           input(type="text" placeholder="First name").form__input
    //-         label.form__element
    //-           input(type="text" placeholder="Last name").form__input
    //-         label.form__element
    //-           input(type="text" placeholder="Phone number").form__input
    //-         label.form__element
    //-           input(type="text" placeholder="Date of birth mm/dd/yyyy").form__input
    //-         .chart
    //-           .chart__box
    //-             svg(viewBox="0 0 345 200" preserveAspectRatio="xMidYMid meet").chart__item
    //-               g
    //-                 polygon(
    //-                   points="10 200, 10 50, 60 50, 60 200"
    //-                   stroke="black"
    //-                   stroke-width="1"
    //-                   fill="firebrick"
    //-                 )
    //-                 polygon(
    //-                   points="60 200, 60 30, 110 30, 110 200"
    //-                   stroke="black"
    //-                   stroke-width="1"
    //-                   fill="blue"
    //-                 )
    //-                 line(x1="0" y1="200" x2="0" y2="0" stroke="black" stroke-width="3%")
    //-                 line(x1="0" y1="200" x2="345" y2="200" stroke="black" stroke-width="3%")
    //-     .keypad.keypad--phone
    //-       button(type="button").keypad__btn
      
    section.phone
      .container
        form.form.form--phone            
          .form__wrapper    
            .form__controll.phone
              label.form__element.form__element--button.back
                button(type="button").form__button
              label.form__element.form__element--button.save
                button(type="button").form__button


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
                          img(alt="Avatar" src="./images/avatars/contact.jpg").contacts__image
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

            .horizontal-line
              svg(viewBox="0 0 1000 100" preserveAspectRatio="none").horizontal-line__icon
                ellipse(
                  cx="500" cy="50" rx="500" ry="8"
                  fill="#414c63"
                )      
            
            .numpad
              ul.numpad__list
                li(
                  v-for="num in 9"
                  :key="num"
                ).numpad__item
                  label.numpad__container
                    .numpad__text 5
                    button(typ.numpad__buttone="button")
                li.numpad__item
                  label.numpad__container
                    .numpad__text *
                    button(typ.numpad__buttone="button")
                li.numpad__item
                  label.numpad__container.zero
                    .numpad__text 0
                    .numpad__text +
                    button(typ.numpad__buttone="button")
                li.numpad__item
                  label.numpad__container
                    .numpad__text #
                    button(typ.numpad__buttone="button")


       

</template>

<script >
export default {
  name: 'app',
  data () {
    return {
      
    }
  }
}
</script>

<style lang="postcss">
  .app-root {     
    height: 100%;
    padding: 15px;
  }
</style>


