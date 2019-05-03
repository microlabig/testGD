<template lang="pug">  
  .app-root
    .keypad
      .keypad__icon
    nav.menu
      ul.menu__list
        li.menu__item
          a(href="#").menu__link.active Contacts
        li.menu__item
          a(href="#").menu__link History    
    section.contacts
      .container
        .search
          input(type="text" placeholder="live search in names and phone").search__input
        .horizontal-line
          svg(viewBox="0 0 1000 100" preserveAspectRatio="none").horizontal-line__icon
            ellipse(
              cx="500" cy="50" rx="500" ry="8"
              fill="#414c63"
            )
        .contacts__table
          ul.contacts__list
            li(
              v-for="contact in 10"
              :key="contact"
            ).contacts__item
              .contacts__row
                .contacts__avatar
                  img(alt="Avatar" src="./images/avatars/contact.jpg").contacts__image
                .contacts__description
                  .contacts__name Giacomo Auilizzoni
                  .contacts__number +18121234567
                .contacts__information
            li(
              v-for="dummy in 100"
              :key="dummy"
            ).contacts__item
              

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


