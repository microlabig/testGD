<template lang="pug">
    .chart
        .chart__box
            svg(
                :viewBox="viewBoxCoordinates" 
                preserveAspectRatio="xMidYMid meet"
            ).chart__svg
                g(
                    v-for="column in columns"
                    :key="column.index"
                )
                    polygon(
                        :points="column.polygonCoordinates"
                        stroke='#414c63'
                        :stroke-width="strokeWidth/2"
                        :fill="column.color"
                    )
                    text(
                        :x="column.quantityCoordinatesX" :y="column.quantityCoordinatesY"
                        :font-size="fontSize"
                        :fill="column.color"
                    ) {{column.quantityText}}
                    text(
                        :x="column.dateCoordinatesX" :y="column.dateCoordinatesY"
                        :font-size="fontSize"
                        :fill="column.color"     
                        :transform="column.dateTransformRotate"                       
                    ) {{column.dateText}}
                        
                line(
                    :x1="linesCoordinates[0].x1" 
                    :y1="linesCoordinates[0].y1" 
                    :x2="linesCoordinates[0].x2" 
                    :y2="linesCoordinates[0].y2" 
                    stroke='#414c63'
                    :stroke-width="strokeWidth"
                )
                line(
                    :x1="linesCoordinates[1].x1" 
                    :y1="linesCoordinates[1].y1" 
                    :x2="linesCoordinates[1].x2" 
                    :y2="linesCoordinates[1].y2" 
                    stroke='#414c63'
                    :stroke-width="strokeWidth/2"
                )
</template>

<script>
import { sortArrayByCallAllDateTime } from '../../helpers/sort';

export default {
    props: {
        outgoingCalls: Array
    },

    data() {
        return {
            sortByDateOutgoing: [], // отсортированный массив звонков по дате

            maxValue: 100, // максимальное значение вьюбокса (100 по-умалчанию)

            fontSize: "5px", // размер шрифта даты и кол-ва звонков (5px по-умолчанию)

            strokeWidth: 1, // ширина обводки svg-элемента, ширина линий (1 по-кмолчанию)

            offsetYFromLoft: 22, // место для отбражения значений кол-ва звонков (22 по-кмолчанию)

            widthColumn: 3, // ширина колонки (3 по-кмолчанию)
            
            columns: [], // массив параметров для отображения колонок в svg-элементе
        }
    },

    computed: {
        //---------------------------------------
        // заполним настройки viewBox svg-графика
        //---------------------------------------
        viewBoxCoordinates() {
            return "0 " + "0 " + this.maxValue + " " + this.maxValue;
        },

        //-----------------------------------------------
        // заполним координаты координатных линий графика 
        //-----------------------------------------------
        linesCoordinates() {
            return [
                {
                    x1: 0,
                    y1: this.maxValue - this.offsetYFromLoft, // для отображения даты
                    x2: 0,
                    y2: 0
                }, // Оу
                {
                    x1: 0,
                    y1: this.maxValue - this.offsetYFromLoft,
                    x2: this.maxValue,
                    y2: this.maxValue - this.offsetYFromLoft,                
                } // Ox
            ]
        }
    },

    //-------------------------------------------------
    // вычислим все элементы для построения svg-графика
    //-------------------------------------------------
    created() {
        let isOdd = false, // для смены цвета колонки
            currDate = new Date(); // текущая дата

        if (!this.outgoingCalls) return; // если нет массива outgoing в текущем пользователе - выйти из хука
        
        // сделаем копию массива звонков текущему пользователю
        this.sortByDateOutgoing = [...this.outgoingCalls];

        // отсортируем по дате (сначала старые)
        sortArrayByCallAllDateTime(this.sortByDateOutgoing);

        // найдем максимальное значение по Оу (максимальное значение количества звонков из массива звонков)
        for (let i = 0; i < this.sortByDateOutgoing.length; i++) 
            if (parseInt(this.sortByDateOutgoing[i].quantity) > this.maxValue) this.maxValue = parseInt(this.sortByDateOutgoing[i].quantity);
        
        if (this.maxValue < 100) this.maxValue = 100; // 20 - максимальное число звонков (чтобы отображался красиво)
        //console.log(this.maxValue);

        // вычислим расстояние до вершины графика 
        this.offsetYFromLoft = this.maxValue * 22 / 100; // 22% - место для отображения даты звонков
        this.strokeWidth = this.maxValue * 1 / 100; // 1% 
        this.fontSize = this.maxValue * 5 / 100 + "px"; // 5%

        // вычислим ширину колонки = 4% от максимального значения        
        this.widthColumn = this.maxValue * 3 / 100;
                
        // вычислим все Х0 (центральные точки) для каждой отображаемой колонки (для каждого элемента массива outgoing)
        const pointer = this.maxValue / (this.sortByDateOutgoing.length + 1); // граничная точка по Ох  каждой колонки
        let pointersArray = [], i = 1, x0 = 0; // массив центральных точек по Ох для каждой колонки, индекс, центральня точка по Ох
        while (1) {
            x0 = Math.round(pointer * i);
            if (x0 >= this.maxValue) 
                break;
            else 
                pointersArray.push(x0);
            i++;
        }
        
        // заполним дополнительные параметры отображения элементов на графике
        for (let i = 0; i < pointersArray.length; i++) {
            const item = this.sortByDateOutgoing[i], // теккущее значение массива outgoing
                date = new Date(item.dateTime), // дата 
                transformFS = this.fontSize.match(/^\d*[.,]?\d*/),
                transform = this.widthColumn * 50 / 100; // для трансформации даты
            let obj = {}, // объект с координатами точек (х1 y1, x2 y2, x3 y3, x4 y4)
                // преобразуем дату для графика
                m = date.getMonth() + 1, d = date.getDate(), y = date.getFullYear() % 100, // месяц, день, год    
                // сформируем двузначные значения
                monthStr = (m < 10) ? ("0" + m) : ("" + m),
                dayStr = (d < 10) ? ("0" + d) : ("" + d),
                yearStr = (y < 10) ? ("0" + y) : ("" + y),
                quantity = item.quantity >= 100 ? 93 : item.quantity, // для координат полигона (93 - это 93% для отображения кол-ва звонков)             
                dateStr = "" + dayStr + "." + monthStr + "." + yearStr;
                if (currDate.toLocaleDateString() === date.toLocaleDateString()) dateStr = "Today"; // если дата совпадает с текущей, то написать "Today"
                    
            obj = {   
                x1: Math.round(pointersArray[i] - this.widthColumn),
                y1: this.linesCoordinates[0].y1,
                x2: Math.round(pointersArray[i] + this.widthColumn),
                y2: Math.round(this.linesCoordinates[1].y2 - this.linesCoordinates[1].y2 * quantity / 100) // здесь берется процентное соотношение (чтобы не улезал за пределы графика)
            };

            isOdd = !isOdd;

            // в массив параметров
            this.columns.push({  
                index: i, // индекс элемента в массиве (для :key d элементе Vue при использовании v-for)
                color: isOdd ? 'firebrick' : 'dodgerblue', // цвет
                polygonCoordinates: "" + obj.x1 + " " + obj.y1 + "," + " " +
                                         obj.x1 + " " + obj.y2 + "," + " " +
                                         obj.x2 + " " + obj.y2 + "," + " " +
                                         obj.x2 + " " + obj.y1, // сформированная строка с координатами полигона
                quantityCoordinatesX: "" + (pointersArray[i] - (("" + item.quantity).length*0.5) * transformFS / 1.75), // кооржината кол-ва звонков по Ох
                quantityCoordinatesY: "" + (obj.y2 - transform), // кооржината кол-ва звонков по Оу
                quantityText: "" + item.quantity, // строка с количеством звонков
                dateCoordinatesX: "" + (pointersArray[i] - this.widthColumn), // кооржината даты звонков по Ох
                dateCoordinatesY: "" + (obj.y1), // кооржината даты звонков по Оу
                dateTransformRotate: "translate(-" + transform + ", " + (transform * 3) +") rotate(90 " + (pointersArray[i]) + " " + Math.round(obj.y1) + ")", // поворот и трансформация даты звонков
                dateText: dateStr // строка с датой звонков
            });
        }
    }
}
</script>
