<template lang="pug">
    section.contacts
      .container
        searchComponent
        horizontalLine
        .contacts__table
          ul.contacts__list
            li(
              v-for="contact in 10"
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
</template>

<script>
    import searchComponent from "../parts/search";
    import horizontalLine from "../parts/horizontalLine";

    export default {
        components: {
            searchComponent, 
            horizontalLine
        }
    }
</script>
