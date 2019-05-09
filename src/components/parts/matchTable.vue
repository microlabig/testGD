<template lang="pug">
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
</template>