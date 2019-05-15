<template lang="pug">
    .controll.controll--phonebig
        .controll__wrapper
            .controll__tooltip
                .controll__text 
                    p Calling...
            .controll__buttonbox                 
                button(
                    type="button"
                    :disabled="inputIsEmpty"
                ).controll__btn  
</template>

<script>
    export default {
        props: {
            inputIsEmpty: Boolean
        }
    }
</script>
