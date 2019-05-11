<template lang="pug">
    label
        input(
            type="text" 
            :placeholder="`${ph}`"
            :value="item"   
            @input="$emit('input', $event.target.value, index)"             
        ).form__input            
</template>

<script>
export default {
    props: {
        item: String,
        ph: String,
        value: String,
        index: Number
    }
}
</script>
