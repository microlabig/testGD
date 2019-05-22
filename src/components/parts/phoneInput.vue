<template lang="pug">
    .form__row   
        label.form__element
            input(
                autofocus
                type="text" 
                placeholder="Please type a number..."
                :value="phoneNumberFormated"   
                @input="letterInputed"
                @keydown="inputKeyDown"                
            ).form__input.phonenumber            
        label(
            :class="{'hidden': inputIsEmpty}"   
        ).form__element.form__element--button.backspace
            button(
                @click.prevent="$emit('deleteLastSymbolInPhoneNumber')"
                type="button"
            ).form__button        
        
</template>

<script>
import { transformPhoneNumber, backTransformPhoneNumber } from '../../helpers/transform';

export default {
    props: {
        phoneNumber: String,
        inputIsEmpty: Boolean
    },

    data() {
        return {
            is_Digit: false
        }
    },

    computed: {
        phoneNumberFormated() {            
            return transformPhoneNumber(this.phoneNumber);
        }
    },

    methods: {
        //------------------------------
        // введено значение в поле ввода
        //------------------------------
        letterInputed() {
            let val = event.target.value;
            // проверим если в поле phoneNumber введена не цифра 
            if (!this.is_Digit) {
                val = transformPhoneNumber(backTransformPhoneNumber(this.phoneNumber));
                event.target.value = val;                
                return;
            }
            this.$emit('input', val);
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
                || e.key === "*"
                || e.key === "#"
                //|| e.key === "+"
                || (this.inputIsEmpty && e.key === "+")
            ) 
                this.is_Digit = true;
            else 
                this.is_Digit = false;                                       
        }
    }
}
</script>
