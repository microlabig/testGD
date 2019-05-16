<template lang="pug">
    .controll.controll--phonebig(
        :class="{'call': is_calling}"
    )
        .controll__wrapper
            .controll__tooltip
                .controll__text 
                    p Calling...
            .controll__buttonbox                 
                button(
                    type="button"
                    :disabled="inputIsEmpty || is_calling"
                    @click.prevent="$emit('madeACall')"
                ).controll__btn  
</template>

<script>
    export default {
        props: {
            inputIsEmpty: Boolean,
            is_calling: Boolean
        }
    }
</script>
