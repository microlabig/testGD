<template lang="pug">
    .controll
        .controll__wrapper
            .controll__tooltip
                .controll__text 
                    p Calling...
            .controll__buttonbox                 
                button(                    
                    type="button"
                    @click.prevent="$emit('showPhone')"
                ).controll__btn  
</template>
