<template lang="pug">
    .controll.controll--phone
        .controll__wrapper
            .controll__tooltip
                .controll__text 
                    p Calling...
            .controll__buttonbox                 
                button(
                    type="button"
                    @click="$emit('showPhone')"
                ).controll__btn  
</template>
