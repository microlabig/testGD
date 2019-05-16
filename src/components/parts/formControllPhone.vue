<template lang="pug">
    .form__controll.phone
        label.form__element.form__element--button.back
            button(
                type="button"
                @click.prevent="!is_calling ? $emit('showBaseWrapper') : true"
            ).form__button
        label(
            :class="{'disable':is_calling || inputIsEmpty || lengthUserSearching!==0}"
        ).form__element.form__element--button.save
            button(
                type="button"                
                :disabled="inputIsEmpty || lengthUserSearching!==0"
                @click.prevent="!is_calling ? $emit('saveUserData') : true"
            ).form__button 
</template>

<script>
    export default {
        props: {
            inputIsEmpty: Boolean,
            lengthUserSearching: Number,
            is_calling: Boolean
        }
    }
</script>
