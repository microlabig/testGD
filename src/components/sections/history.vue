<template lang="pug">
    section.history
      .container   
        .contacts__table.contacts__table--history
          ul.contacts__list
            li(
              v-for="contact in 10"
              :key="contact"
            ).contacts__item
              .contacts__row
                .contacts__hamburger
                  .contacts__hamburger-icon
                    .contacts__hamburger-line(
                      v-for="line in 3"
                      :key="line"
                    )
                .contacts__description
                  .contacts__name Giacomo Auilizzoni
                  .contacts__number +78121234567
                .contacts__date
                  .contacts__day Today
                  .contacts__year at 12:10PM 
</template>
