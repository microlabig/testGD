<template lang="pug">
    .form__controll.phone
        label.form__element.form__element--button.back
            button(
                type="button"
                @click="$emit('showBaseWrapper')"
            ).form__button
        label(
            :class="{'disable':setIsEmptyInput}"
            setIsEmptyInput
        ).form__element.form__element--button.save
            button(
                type="button"                
                :disabled="setEmptyPhone"
            ).form__button 
</template>

<script>
    export default {
        props: {
            setEmptyPhone: Boolean,
            setIsEmptyInput: Boolean
        }
    }
</script>
