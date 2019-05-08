<template lang="pug">
    .app-wrapper
        //- .base-wrapper
        //-     navigation        
        //-     contacts
        //-     history
        //-     controll
        //- contactData
        phone

</template>

<script>
    import contacts from "./sections/contacts";
    import history from "./sections/history";
    import contactData from "./sections/contactData";
    import phone from "./sections/phone";

    import navigation from "./parts/navigation";
    import controll from "./parts/controll";
    import controllPhoneBig from "./parts/controllPhoneBig";


    export default {
        components: {
            navigation, contacts, history, controll, 
            contactData, 
            phone
        }
    }
</script>

<style lang="postcss">
    .app-wrapper,
    .base-wrapper {
        height: 100%;
    }
</style>

