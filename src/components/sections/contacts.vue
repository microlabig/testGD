<template lang="pug">
    section.contacts
      .container
        searchComponent(
          @searchStrInputed="searchStr => $emit('searchStrInputed',searchStr)"
        )
        horizontalLine
        .contacts__table
          ul.contacts__list
            li(
              v-for="user in usersSearching"
              :key="user.id"
              @click="$emit('showContactInfo', user)"
            ).contacts__item
              .contacts__row
                .contacts__avatar
                  .contacts__avatar-box
                    img(
                      alt="Avatar" 
                      :src="`${user.userpic}`"
                      @error="errorLoadingImage($event,user)"
                    ).contacts__image
                .contacts__description
                  .contacts__name {{user.name}} {{user.lastName}}
                  .contacts__number {{`${formatingPhoneNumber(user.phoneNumber)}`}}
                .contacts__information
                  .contacts__information-box    
</template>

<script>
  import searchComponent from "../parts/search";
  import horizontalLine from "../parts/horizontalLine";

  import { transformPhoneNumber } from '../../helpers/transform.js'; 
  import { defaultURLPicture } from "../../helpers/urls";

  export default {
    components: {
      searchComponent,
      horizontalLine
    },

    props: {
      usersSearching: Array
    },

    methods: {
      // в случае ошибки загрузки аватарки
      errorLoadingImage(e,user) { 
        e.target.src = defaultURLPicture;
        user.userpic = e.target.src;
      },

      // форматируем номер телефона
      formatingPhoneNumber(number) {
        return transformPhoneNumber(number);
      }
    }
  };
</script>
