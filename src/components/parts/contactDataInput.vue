<template lang="pug">
    label
        input(
            type="text" 
            :placeholder="`${ph}`"
            :value="valueEdited"   
            @input="LetterInputed"
        ).form__input            
</template>

<script>
    import { transformPhoneNumber, backTransformPhoneNumber } from '../../helpers/transform.js'; 

    export default {
        props: {
            item: String,
            ph: String,
            value: String,
            index: Number,
            phone: String
        },
        computed: {
            valueEdited() {
                if (this.index === 2)  // если это поле ввода номера телефона
                    return transformPhoneNumber(this.item); // трансформируем его
                return this.item;
            }
        },
        methods: {
            LetterInputed() {
                let val = event.target.value;
                if (this.index === 2) 
                    val = transformPhoneNumber(backTransformPhoneNumber(event.target.value));
                
                this.$emit('input', val, this.index);
            }
        }
    }
</script>
