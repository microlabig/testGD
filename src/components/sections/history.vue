<template lang="pug">
    section.history
      .container   
        .contacts__table.contacts__table--history
          ul(
            @dragenter="dragEnter"
            @dragleave="dragLeave"
            @dragover="dragOver"
            @drop="drop"
          ).contacts__list
            li(
              v-for="user in users"
              :key="user.id"              
            ).contacts__item
              .contact__dropzone
              .contacts__row
                .contacts__hamburger
                  .contacts__hamburger-icon(
                    @dragstart="dragStart"
                    @dragend="dragEnd"
                    draggable="true"
                    @touchstart="touchStart"
                    @touchmove="touchMove"
                    @touchend="touchEnd"
                  )
                    .contacts__hamburger-line(
                      v-for="line in 3"
                      :key="line"                      
                    )
                .contacts__description
                  .contacts__name {{user.name}} {{user.lastName}}
                  .contacts__number {{user.phoneNumber}}
                .contacts__date
                  .contacts__day {{user.incoming}}
                  .contacts__year at 12:10PM 
              .contact__dropzone--under           
            
</template>

<script>
var movedLI = {}, // перемещаемый объект li-шка
    parentUL = {}, // UL - родитель
    elem = {},  // временный объект под перемещаемым movedLI (во время происхождения события touchMove)
    currLI = {}, // элемент LI, который содержит elem и находящийся под координатами Х и У при перемещении объекта
    currLINum = -1, // номер элемента currLI в списке parentUL
    allLI = [], // для всех li в таблице
    is_Time = false, // для "правильности" работы setTimeout в touchMove;
    checkedLIs = [], // массив для хранения элементов, над которыми мы перемещали movedLI
    timerTouchInterval = 100, // интервал таймера
    timerTouch = null; // таймер для отслеживания поиска элементов в touchmove (1 раз в timerTouchInterval мс) - для оптимизации!

var moveOffsetY = 0,
    positionY = 0,
    positionX = 0,
    heightLI = 0;

var currentMovedLiNum = 0; // номер перемещаемой li (movedLI)

export default {
  props: {
    users: Array
  },

  methods: {
    dragStart() {
      console.log("dragStart");
    },
    dragEnd() {
      console.log("dragEnd");
    },

    dragEnter() {
      console.log("dragEnter");
    },
    dragLeave() {
      console.log("dragLeave");
    },
    dragOver() {
      console.log("dragOver");
    },
    drop() {
      console.log("drop");
    },

    touchStart(e) {
      let touch = e.targetTouches; // закешируем массив текущих нажатий
      if (touch.length === 1) { // если всего одно нажатие

        let target = e.target; // закешируем нажатие

        // найдем родительский элемент LI
        movedLI = target.parentElement;
        while (movedLI.tagName !== "LI") {
          movedLI = movedLI.parentElement;
        }        
        // найдем родителя UL
        parentUL = movedLI.parentElement;
        // определим номер передвигаемой LI-шки
        for (let i in parentUL.children) {
          if (parentUL.children[i] == movedLI) currentMovedLiNum = i;
        }
        // обнулим вспомогательные переменные
        moveOffsetY = 0;
        positionY = 0; positionX = 0;  
        elem = {}; currLI = {}; currLINum = -1;
        checkedLIs = [];

        // определим высоту movedLI для последующего определения его центра по Оy
        heightLI = movedLI.getBoundingClientRect().height; 

        // сделаем li-шке position: absolute (для перемещения)
        movedLI.classList.add("is-dragged"); 
        // вычислим смещение по Y
        moveOffsetY = movedLI.offsetTop - touch[0].pageY; 
        // 150 - для того, чтобы точно указывать на список контактов (это делается для определения элемента под передвигаемой li-шке)
        positionX = movedLI.getBoundingClientRect().left + 150; 
        
        // заполним массив всех li-шек для дальнейшего изменения порядка        
        allLI = [...parentUL.children];

        // разрешим использовать специальный таймер (для оптимизации!) для поиска необходимого места перемещаемого элемента movedLI в списке UL
        is_Time = true;  
      }
    },


    touchMove(e) {
      let x = 0, y = 0, c = 0; // с - счетчик поиска родительских элементов
      let is_found = false; // признак наличия найденного элемента li - currLI - под координатами (x,y) в массиве найденных li-шек (checkedLIs)
      
      let touch = e.targetTouches;

      if (touch.length === 1) {
        positionY = touch[0].pageY + moveOffsetY; // вычислим смещение во время перемещения объекта LI
        movedLI.style.top = positionY + "px"; // переместим объект LI (movedLI)
        
        if (is_Time) { 
          is_Time = false;

          timerTouch = setTimeout( ()=> {
            // определим элемент под перемещающимся объектом
            x = positionX;
            y = movedLI.getBoundingClientRect().top + heightLI / 2; // 
            movedLI.classList.add('displaynone'); // скроем перемещаемый элемент movedLI для определения елемента под координатами (x,y)
            elem = document.elementFromPoint(x, y); // определим элемент под координатами (x,y)            
            movedLI.classList.remove('displaynone'); // покажем перемещаемый элемент movedLI (чтоб не возникало дергания)

            //далее, определим li-шку для найденного elem
            if (elem) { // если не null

              // возьмем родителя для найденного выше elem 
              currLI = elem.parentElement;         

              if (currLI) { // если не null (т.к. может быть за границей UL, напр., на body, html)

                // найдем li с классом .contacts__item для определенного выше elem
                while (currLI!==null && !currLI.classList.contains("contacts__item") && c<10) { // 10 - максимальное число поисков LI.contacts__item (макс 5)
                  currLI = currLI.parentElement;
                  c++;
                }            

                // если нашли родителя LI.contacts__item
                if (currLI!==null && c < 9 && currLI.classList.contains("contacts__item")) {                   
                  // покажем дочерний элемент .contact__dropzone для индикации нового места в списке 
                  currLI.classList.add("is-found");  
                  
                  if (checkedLIs.length === 0) checkedLIs.push(currLI); // добавим currLI в массив всех пройденных элементов LI - checkedLIs при условии, что в checkedLIs нет элементов
                  else { 
                    // иначе проверим, если currLI нет в списке checkedLIs, то поместим его (currLI) в этот массив (checkedLIs)
                    is_found = false;
                    for (let i=0; i<checkedLIs.length; i++) {
                      if (checkedLIs[i] === currLI) {
                        is_found = true;
                        break;
                      }
                    }   
                    if (!is_found) checkedLIs.push(currLI);
                  }                                    

                  // пройдемся по checkedLIs для удаления класса 
                  checkedLIs.forEach( li => li !== currLI ? li.classList.remove('is-found') : 1);
                } 
              }
            }            

            is_Time = true; // разрешим поиск элементов под координатами (x,y)
          }, timerTouchInterval);                    
        }        

      } 
    },

    touchEnd(e) {
      // отменим действия таймера, если он был запущен в touchmove
      clearTimeout(timerTouch); 

      // определим номер currLI в общем списке всех LI
      currLINum = allLI.forEach( (li, index) => li === currLI ? index : -1 );
      
      // TODO: убрать нижние 2 строки
      movedLI.classList.remove("is-dragged"); // вернем сво-во position
      movedLI.style.top = "initial"; // вернем сво-во top в первоначальное положение

      checkedLIs.forEach( li => li.classList.remove('is-found')); // уберем все индикации из пройденных li-шек
    }


  }
};
</script>
