<template lang="pug">
    .numpad
        ul.numpad__list
            li(
                v-for="num in 9"
                :key="num"
            ).numpad__item
                label(
                    @click="clicked"
                ).numpad__container
                    .numpad__text {{num}}
                    button(type="button")
            li.numpad__item
                label.numpad__container
                    .numpad__text *
                    button(type="button")
            li.numpad__item
                label.numpad__container.zero
                    .numpad__text 0
                    .numpad__text +
                    button(type="button")
            li.numpad__item
                label.numpad__container
                    .numpad__text #
                    button(type="button")
</template>

<script>
    export default {
        data() {
            return {
                result: [], // содержит тип модели кликов  
                delay: 700, 
                clicks: 0,
                timer: null
            }
        },
        methods: {
            clicked() {
                this.clicks++;
                if (this.clicks === 1) {
                    var self = this;
                    this.timer = setTimeout( () => {
                        self.result.push(event.type);
                        self.clicks = 0;
                    }, this.delay);
                } else {
                    clearTimeout(this.timer);  
                    this.result.push('dblclick');
                    this.clicks = 0;
                }  
                console.log(this.result);
                      
            }
        }
    }
</script>
