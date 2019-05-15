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
                  .contacts__number {{user.phoneNumber}}
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
  },
  props: {
    usersSearching: Array
  },
  methods: {
    errorLoadingImage(e,user) { // в случае ошибки загрузки аватарки
      e.target.src = './images/contact.jpg';
      user.userpic = e.target.src;
    }
  }
};
</script>
