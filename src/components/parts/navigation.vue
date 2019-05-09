<template lang="pug">
    nav.menu
      ul.menu__list
        li.menu__item
          a(
              href="#"
              :class="{'active':showBaseContacts}"
              @click.prevent="$emit('showContacts')"              
            ).menu__link Contacts
        li.menu__item
          a(
              href="#"              
              :class="{'active':showBaseHistory}"
              @click.prevent="$emit('showHistory')"              
            ).menu__link History    
</template>

<script>
export default {
    props: {        
        showBaseContacts: Boolean,
        showBaseHistory: Boolean
    }
}
</script>
