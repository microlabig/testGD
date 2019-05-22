<template lang="pug">
    .search
        input(
            autofocus
            type="text" 
            placeholder="live search in names and phone"
            v-model="searchStr"
            @input="$emit('searchStrInputed', searchStr)"
        ).search__input
</template>

<script>
export default {
    data() { 
        return {
            searchStr: "" // строка поиска необходимого контакта
        }
    }
}
</script>
