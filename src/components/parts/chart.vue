<template lang="pug">
    .chart
        .chart__box
            svg(
                :viewBox="viewBoxCoordinates" 
                preserveAspectRatio="none"
            ).chart__item
                g(
                    v-for="object in sortByDateOutgoing"
                    :key="object.dateTime"
                )
                    polygon(
                        points="10 200, 10 50, 60 50, 60 200"
                        stroke="black"
                        fill="firebrick"
                    )                    
                line(
                    x1="0" 
                    :y1="ViewBoxX2Y2.y2" 
                    x2="0" 
                    y2="0" 
                    stroke="black"
                )
                line(
                    x1="0" 
                    :y1="ViewBoxX2Y2.y2" 
                    :x2="ViewBoxX2Y2.x2" 
                    :y2="ViewBoxX2Y2.y2" 
                    stroke="black"
                )
</template>

<script>
import {sortArrayByCallAllDateTime} from '../../helpers/sort';

export default {
    props: {
        outgoingCalls: Array
    },

    data() {
        return {
            sortByDateOutgoing: [],
            maxX: 0,
            maxY: 0,
            offsetYFromLoft: 200,
            offsetXFromRightBorder: 200,
            ViewBoxX2Y2: {
                x2: 0,
                y2: 0
            },
            viewBoxCoordinates: "",
            columns: [],
        }
    },

    created() {

        //console.log(this.outgoingCalls);
        this.sortByDateOutgoing = [...this.outgoingCalls];

        //2
        sortArrayByCallAllDateTime(this.sortByDateOutgoing);

        //3
        const offset = 150, 
              widthColumn = 30,
              heightColumn = 0;                   

        //4
        for (let i = 0; i < this.sortByDateOutgoing.length; i++) {
            if (parseInt(this.sortByDateOutgoing[i].quantity) > this.maxY) this.maxY = parseInt(this.sortByDateOutgoing[i].quantity);
        }
        console.log('maxY=', this.maxY);        

        //5
        this.maxX = this.sortByDateOutgoing.length * (offset + widthColumn) * 2;
        console.log('maxX=',this.maxX);

        //6
        this.ViewBoxX2Y2.x2 = this.maxX + this.offsetXFromRightBorder;
        this.ViewBoxX2Y2.y2 = this.maxY + this.offsetYFromLoft;
        //console.log(ViewBoxX2Y2);
        this.viewBoxCoordinates = "0 " + "0 " + this.ViewBoxX2Y2.x2 + " " + this.ViewBoxX2Y2.y2;
        //console.log(this.viewBoxCoordinates);
        

        //7
        
        //8
        for (let i = 0; i < this.sortByDateOutgoing.length; i++) {
            const item = this.sortByDateOutgoing[i],
                  date = new Date(item.dateTime);

            let obj = {};

            //TODO: сделать координаты

            obj = {
                points: "",
                dateText: date.toLocaleDateString()
            }            

            console.log(obj.dateText);
            
            //this.column
        }



        
    }
}
</script>
