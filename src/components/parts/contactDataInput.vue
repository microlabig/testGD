<template lang="pug">
    input(
        type="text" 
        :placeholder="`${ph}`"
        :value="valueEdited"   
        @input="letterInputed"
        @keydown="inputKeyDown"
    ).form__input            
</template>

<script>
    import { transformPhoneNumber, backTransformPhoneNumber } from '../../helpers/transform'; 

    export default {
        props: {
            item: String,
            ph: String,
            value: String,
            index: Number,
            phone: String
        },

        data() {
            return {
                is_Digit: false
            }
        },

        computed: {
            valueEdited() {
                if (this.index === 2)  // если это поле ввода номера телефона
                    return transformPhoneNumber(this.item); // трансформируем его
                return this.item;
            }            
        },

        methods: {
            //------------------------------
            // введено значение в поле ввода
            //------------------------------
            letterInputed() {   
                let val = event.target.value;                 

                // проверим если в поле phoneNumber введена не цифра 
                if (this.index === 2) {  
                    if (!this.is_Digit) {
                        val = transformPhoneNumber(backTransformPhoneNumber(this.item));
                        event.target.value = val;                
                        return;
                    }
                }
                
                this.$emit('input', val, this.index);
            },

            //---------------------------------------
            // определение кода нажатия клавиш клавиш
            //---------------------------------------
            inputKeyDown(event) {            
                let e = event;                      

                if (
                    isFinite(e.key) && e.key !== " " 
                    || e.keyCode === 8 // 8 - backspace
                    || e.keyCode === 46 // 46 - delete
                    || e.key === "+"
                    //|| (this.inputIsEmpty && e.key === "+")
                ) 
                    this.is_Digit = true;
                else 
                    this.is_Digit = false;                                       
            }
        }
    }
</script>
