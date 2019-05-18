<template lang="pug">
    .form__row        
        label.form__element
            input(
                type="text" 
                placeholder="Please type a number..."
                :value="phoneNumberFormated"   
                @input="$emit('input', $event.target.value)"
                @change="changedInput"
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
import { transformPhoneNumber } from '../../helpers/transform.js';

export default {
    props: {
        phoneNumber: String,
        inputIsEmpty: Boolean
    },
    data() {
        return {

        }
    },
    computed: {
        phoneNumberFormated() {
            return transformPhoneNumber(this.phoneNumber);
        }
    },
    methods: {
        changedInput() {
            
        }
    }
}
</script>
