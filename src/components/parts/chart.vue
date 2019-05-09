<template lang="pug">
    .chart
        .chart__box
            svg(
                viewBox="0 0 345 200" 
                preserveAspectRatio="xMidYMid meet"
            ).chart__item
                g
                    polygon(
                        points="10 200, 10 50, 60 50, 60 200"
                        stroke="black"
                        stroke-width="1"
                        fill="firebrick"
                    )
                    polygon(
                        points="60 200, 60 30, 110 30, 110 200"
                        stroke="black"
                        stroke-width="1"
                        fill="blue"
                    )
                line(x1="0" y1="200" x2="0" y2="0" stroke="black" stroke-width="3%")
                line(x1="0" y1="200" x2="345" y2="200" stroke="black" stroke-width="3%")
</template>

