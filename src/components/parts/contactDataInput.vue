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
    import { transformPhoneNumber, backTransformPhoneNumber } from '../../helpers/transform.js'; 

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
            // введено значение в поле ввода
            letterInputed() {   
                let val = event.target.value;
                
                /* // проверим если в поле phoneNumber введена не цифра
                if (this.index === 2) {  
                    if (!this.is_Digit) { 
                        if (val.length > 0)
                            if (this.item !== "") event.target.value = transformPhoneNumber(backTransformPhoneNumber(this.item));
                            else event.target.value = "";                          
                            //const patternPhoneNumber = /^\+?\d|\d/g;                       
                        return;
                    } else
                        if (val.length > 0)
                            val = transformPhoneNumber(backTransformPhoneNumber(val)); 
                }        */   

                // проверим если в поле phoneNumber введена не цифра 
                if (this.index === 2) {  
                    if (!this.is_Digit) {
                        val = transformPhoneNumber(backTransformPhoneNumber(this.item));
                        event.target.value = val;                
                        return;
                    }
                }

                /* if (val.length > 0)
                    val = backTransformPhoneNumber(val);  */
                this.$emit('input', val, this.index);
            },

            /* 
            // определение кода нажатия клавиш клавиш
            inputKeyDown(e) {
                
                let code = e.keyCode;
                if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || (code === 8) || (code === 46))
                    this.is_Digit = true;
                else 
                    this.is_Digit = false;                           
            } */
            // определение кода нажатия клавиш клавиш
            /*
                 0  1  2  3   4   5   6   7   8   9 (на основном блоке клавиатуры)
                48 49 50 51  52  53  54  55  56  57 (коды клавиш)
                
                 0  1  2  3   4   5   6   7   8   9 (на блоке Numpad)
                96 97 98 99 100 101 102 103 104 105 (коды клавиш)

                8 - backspace
                46 - delete
            */
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
