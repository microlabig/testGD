<template lang="pug">
    .form__controll.phone
        label.form__element.form__element--button.back
            button(
                type="button"
                @click.prevent="$emit('showBaseWrapper')"
            ).form__button
        label(
            :class="{'disable':inputIsEmpty || lengthUserSearching!==0}"
            inputIsEmpty
        ).form__element.form__element--button.save
            button(
                type="button"                
                :disabled="inputIsEmpty || lengthUserSearching!==0"
                @click.prevent="$emit('saveUserData')"
            ).form__button 
</template>

<script>
    export default {
        props: {
            inputIsEmpty: Boolean,
            lengthUserSearching: Number
        }
    }
</script>
