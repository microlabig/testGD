<template lang="pug">
    .numpad
        ul.numpad__list
            li(
                v-for="num in 9"
                :key="num"
            ).numpad__item
                label(
                    @click.prevent="clicked(num)"
                ).numpad__container
                    .numpad__text {{num}}
                    button(type="button").numpad__button
            li.numpad__item
                label(
                    @click.prevent="clicked('*')"
                ).numpad__container
                    .numpad__text *
                    button(type="button").numpad__button
            li.numpad__item
                label(
                    @click.prevent="doubleClicked"
                ).numpad__container.zero
                    .numpad__text 0
                    .numpad__text +
                    button(type="button").numpad__button
            li.numpad__item
                label(
                    @click.prevent="clicked('#')"
                ).numpad__container
                    .numpad__text #
                    button(type="button").numpad__button
</template>

<script>
    var clicks = 0, timeout;

    import { setTimeout, clearTimeout } from 'timers';

    export default {
        data() {
            return {
                number: [],
                clicksTime: 250
            }
        },        
        methods: {
            clicked(num) {
                this.$emit('numpadClicked', num);
            },
            
            doubleClicked() {                
                clicks++;
                if (clicks == 1) { // click
                   timeout = setTimeout( ()=> {
                       clicks = 0; 
                       this.$emit('numpadClicked', '0');                      
                   }, this.clicksTime);
                } else { // double click
                    clearTimeout(timeout);
                    clicks = 0; 
                    this.$emit('numpadClicked', '+');                   
                }
            }

        }
    }
</script>
