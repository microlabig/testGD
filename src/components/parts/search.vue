<template lang="pug">
    .search
        input(
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
            searchStr: ""
        }
    }
}
</script>
