<template lang="pug">
    .form__controll        
        label.form__element.form__element--button.back
            button(
                type="button"
                @click="$emit('showBaseWrapper')"
            ).form__button
        label.form__element.form__element--button.save
            button(type="button").form__button
</template>
