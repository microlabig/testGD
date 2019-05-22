<template lang="pug">
    .form__match-table
        .contacts__table
            ul.contacts__list
                li(
                    v-for="contact in userSearching"
                    :key="contact.id"
                    @click="$emit('userChange', contact.id)"
                ).contacts__item
                    .contacts__row
                        .contacts__avatar
                            .contacts__avatar-box
                                img(
                                    alt="Avatar" 
                                    :src="`${contact.userpic}`"
                                ).contacts__image
                        .contacts__description
                            .contacts__name {{contact.name}} {{contact.lastName}}
                            .contacts__number {{`${formatingPhoneNumber(contact.phoneNumber)}`}}
                        .contacts__information
                            .contacts__information-box            
</template>

<script>
    import { transformPhoneNumber } from '../../helpers/transform'; 

    export default {
        props: {
            userSearching: Array
        },
        
        methods: {
            //---------------------------
            // форматируем номер телефона
            //---------------------------
            formatingPhoneNumber(number) {
                return transformPhoneNumber(number);
            }
        }
    }
</script>
