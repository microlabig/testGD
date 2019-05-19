<template lang="pug">
    .form__controll.phone
        label.form__element.form__element--button.back
            button(
                type="button"
                @click.prevent="!is_calling ? $emit('showBaseWrapper') : true"
            ).form__button
        label(
            :class="{'disable':is_calling || inputIsEmpty || phoneNumberIsFounded || !is_ValidPhone}"
        ).form__element.form__element--button.save
            button(
                type="button"                
                :disabled="is_calling || inputIsEmpty || phoneNumberIsFounded || !is_ValidPhone"
                @click.prevent="!is_calling ? $emit('saveUserData') : true"
            ).form__button 
</template>

<script>
    export default {
        props: {
            inputIsEmpty: Boolean,
            is_calling: Boolean,
            phoneNumberIsFounded: Boolean,
            is_ValidPhone: Boolean
        }
    }
</script>
