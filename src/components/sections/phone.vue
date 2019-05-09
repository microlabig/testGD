<template lang="pug">
    section.phone
      .container
        form.form.form--phone            
          .form__wrapper    
            formControllPhone(
                :setEmptyPhone="setEmptyPhone"
                :setIsEmptyInput="setIsEmptyInput"
                @showBaseWrapper="$emit('showBaseWrapper')"
            )
            matchTable(
                :class="{'hidden': setEmptyPhone}"
            )
            .form__row
              label.form__element
                input(
                    type="text" 
                    placeholder="Please type a number..."
                    v-model="phoneNumber"
                ).form__input.phonenumber
              label(
                  :class="{'hidden': setIsEmptyInput}"
                  @click.prevent="deleteLastSymbolInPhoneNumber"
              ).form__element.form__element--button.backspace
                button(type="button").form__button
            horizontalLine              
            numpad
            controllPhoneBig(
                :setEmptyPhone="setEmptyPhone"
                :setIsEmptyInput="setIsEmptyInput"
                :class="{'disable':setIsEmptyInput}"
            )
</template>

<script>
    import formControllPhone from "../parts/formControllPhone";
    import controllPhoneBig from "../parts/controllPhoneBig";
    import matchTable from "../parts/matchTable";
    import horizontalLine from "../parts/horizontalLine";
    import numpad from "../parts/numpad";

    export default {
        components: {
            formControllPhone,
            controllPhoneBig,
            matchTable,
            horizontalLine,
            numpad
        },
        props: {
            modeShowPhone: String
        },
        data() {
            return {
                isEmptyInput: true,
                phoneNumber: ""
            }
        },
        computed: {
            setEmptyPhone() {
                let f = true;
                switch (this.modeShowPhone) {
                    case 'empty':
                        f = true;            
                        break;
                    case 'contact':
                        f = false;                  
                        break;                      
                }
                return f;
            },
            setIsEmptyInput() {
                if (!this.phoneNumber) 
                    this.isEmptyInput = true; 
                else 
                    this.isEmptyInput = false;                
                return this.isEmptyInput;
            }
        },
        methods: {
            deleteLastSymbolInPhoneNumber() {                
                let str = '';                
                str = this.phoneNumber.substring(0, this.phoneNumber.length - 1);                
                this.phoneNumber = str;
            }
        }
    }
</script>
