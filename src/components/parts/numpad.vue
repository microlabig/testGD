<template lang="pug">
    .numpad
        ul.numpad__list
            li(
                v-for="num in 9"
                :key="num"
            ).numpad__item
                label.numpad__container
                    .numpad__text 5
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