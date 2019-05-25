<template lang="pug">
    section.history
      .container   
        .contacts__table.contacts__table--history
          ul(
            @dragover="dragOver"
          ).contacts__list
            li(
              v-for="user in historyArrayEdited"
              :key="user.historyID"
              @click="$emit('historyItemClicked', user)"             
            ).contacts__item
              .contact__dropzone
              .contacts__row
                .contacts__hamburger(
                  @touchmove.prevent.stop
                  @scroll.prevent.stop
                  @mousewheel.prevent.stop
                )
                  .contacts__hamburger-icon(
                    draggable="true"
                    @dragstart="dragStart"
                    @dragend="dragEnd"                    
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
                  .contacts__number {{`${formatingPhoneNumber(user.phoneNumber)}`}}
                .contacts__date
                  .contacts__day {{user.additionalInformation[0]}}
                  .contacts__year {{user.additionalInformation[1]}}
              .contact__dropzone--under           
            
</template>

<script>
import { transformPhoneNumber } from '../../helpers/transform'; 
import { transformHistoryItems } from '../../helpers/historyItems'; 

var parentUL = {}, // UL - родитель
    movedLI = {}, // перемещаемый объект li-шка
    currentMovedLiNum = 0, // номер перемещаемой li (movedLI)    
    elem = {},  // временный объект под перемещаемым movedLI (во время происхождения события touchMove)
    currLI = {}, // элемент LI, который содержит elem и находящийся под координатами Х и У при перемещении объекта
    currLINum = -1, // номер элемента currLI в списке parentUL    
    is_Time = false, // для поиска элементов под перемещаемым объектом каждые timerTouchInterval мс
    checkedLIs = [], // массив для хранения элементов, над которыми мы перемещали movedLI
    lastLI = {}, // последний элемент в UL списке parentUL
    placeUnderUL = false,
    moveOffsetY = 0, // смещение по У перемещаемого элемента
    positionY = 0,
    positionX = 0,
    timerTouch = null, // таймер для отслеживания поиска элементов в touchmove (1 раз в timerTouchInterval мс) - для оптимизации!
    timerTouchInterval = 100; // интервал таймера 

export default {
  props: {
    historyUsersCalls: Array
  },

  data() {    
    return {
      historyArray: []
    }
  },

  computed: {
    // добавим поле historyID 
    historyArrayEdited() { 
      return transformHistoryItems(this.historyArray);
    }
  },

  created() {
    this.historyArray = [...this.historyUsersCalls];
  },

  methods: {
    /*-------------------------------------------------
      старт перемещения элемента (Drag and Drop Event)
    -------------------------------------------------*/
    dragStart(e) {
      this.touchStart(e);
    },

    /*--------------------------------------------------------------------------------------
      пользователь прекратил перемещение элемента, переместим элемент (Drag and Drop Event)
    --------------------------------------------------------------------------------------*/
    dragEnd(e) {
     this.touchEnd(e);
    },

    /*----------------------------------------------------------------
      перемещение элемента и поиск для него нового места (TouchEvent)
    ----------------------------------------------------------------*/
    dragOver(e) {
      let x = 0, y = 0, c = 0, // с - счетчик поиска родительских элементов
          is_found = false, // признак наличия найденного элемента li - currLI - под координатами (x,y) в массиве найденных li-шек (checkedLIs)
          ev = e;

        positionY = ev.pageY + moveOffsetY; // вычислим смещение во время перемещения объекта LI        
        movedLI.style.top = positionY + "px"; // переместим объект LI (movedLI)
        
        if (is_Time) { // запустим алгоритм поиска элементов над которыми перемещается movedLI
          is_Time = false;

          // определим элемент под перемещающимся объектом (определение происходит не постоянно, каждые timerTouchInterval мс)
          timerTouch = setTimeout( ()=> {
            // определим необходимые координаты (x,y)
            x = positionX;
            y = movedLI.getBoundingClientRect().top + movedLI.getBoundingClientRect().height / 2; // середина li по Оу

            // скроем перемещаемый элемент movedLI для определения елемента под координатами (x,y)
            movedLI.classList.add('displaynone'); 
            // определим элемент под координатами (x,y) 
            elem = document.elementFromPoint(x, y);  
            // покажем перемещаемый элемент movedLI (чтоб не возникало дергания)          
            if (movedLI.classList.contains('displaynone')) movedLI.classList.remove('displaynone'); 

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
                          
                if (currLI!==null && c < 9 && currLI.classList.contains("contacts__item")) {  // если нашли родителя LI.contacts__item               
                  
                  if (lastLI!==null && movedLI.getBoundingClientRect().top > lastLI.getBoundingClientRect().top) { // если перемещаемая li ниже всего списка                                     
                    placeUnderUL = true;
                    if (currLI.classList.contains("is_found")) currLI.classList.remove("is_found");
                    lastLI.classList.add("is_found--under");                    
                  }
                  else {                    
                    placeUnderUL = false;
                    if (lastLI.classList.contains("is_found--under")) lastLI.classList.remove("is_found--under");
                    currLI.classList.add("is_found");  // покажем дочерний элемент .contact__dropzone для индикации нового места в списке                     
                  }                  

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

                  // пройдемся по checkedLIs для удаления класса индикации "посадочного" места
                  checkedLIs.forEach( li => {
                    if (li !== currLI) 
                      if (li.classList.contains("is_found")) li.classList.remove("is_found");
                  });                  
                } 
              }
            }
            is_Time = true; // разрешим поиск элементов под координатами (x,y)
          }, timerTouchInterval);                    
        }       
    },

    /*-----------------------------------------
      старт перемещения элемента (TouchEvent)
    -----------------------------------------*/
    touchStart(e) {
      let type = e.type,
          touch = (type === 'touchstart') ? e.targetTouches : e; // закешируем массив текущих нажатий
      
      if (touch.length === 1 || type !== 'touchstart') { // если всего одно нажатие

        let target = e.target; // закешируем нажатие

        // обнулим вспомогательные переменные
        elem = {}; currLI = {}; currLINum = -1; checkedLIs = [], placeUnderUL = false;

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

        // определим последний элемент для последующего пределения позиции когда movedLI необходимо переместить в конец 
        lastLI = parentUL.children[parentUL.children.length - 1];
        if (parentUL.children.length>1 && movedLI === lastLI) lastLI = parentUL.children[parentUL.children.length - 2];

        // вычислим смещение по Y
        if (type === 'touchstart') moveOffsetY = movedLI.offsetTop - touch[0].pageY; 
        else moveOffsetY = movedLI.offsetTop - e.pageY;        
        positionX = movedLI.getBoundingClientRect().left + 150;  // 150 - для того, чтобы точно указывать на список контактов (это делается для определения элемента под передвигаемой li-шке)                       

        // сделаем li-шке position: absolute (для перемещения)
        movedLI.classList.add("is_moved");

        // разрешим использовать специальный таймер (для оптимизации!) для поиска необходимого места перемещаемого элемента movedLI в списке UL
        is_Time = true;  
      }
    },

    /*----------------------------------------------------------------
      перемещение элемента и поиск для него нового места (TouchEvent)
    ----------------------------------------------------------------*/
    touchMove(e) {
      let x = 0, y = 0, c = 0, // с - счетчик поиска родительских элементов
          is_found = false, // признак наличия найденного элемента li - currLI - под координатами (x,y) в массиве найденных li-шек (checkedLIs)
                
          touch = e.targetTouches; // закешируем массив текущих нажатий

      if (touch.length === 1) { // если всего одно нажатие
        positionY = touch[0].pageY + moveOffsetY; // вычислим смещение во время перемещения объекта LI        
        movedLI.style.top = positionY + "px"; // переместим объект LI (movedLI)
        
        if (is_Time) { // запустим алгоритм поиска элементов над которыми перемещается movedLI
          is_Time = false;

          // определим элемент под перемещающимся объектом (определение происходит не постоянно, каждые timerTouchInterval мс)
          timerTouch = setTimeout( ()=> {
            // определим необходимые координаты (x,y)
            x = positionX;
            y = movedLI.getBoundingClientRect().top + movedLI.getBoundingClientRect().height / 2; // середина li по Оу

            // скроем перемещаемый элемент movedLI для определения елемента под координатами (x,y)
            movedLI.classList.add('displaynone'); 
            // определим элемент под координатами (x,y) 
            elem = document.elementFromPoint(x, y);  
            // покажем перемещаемый элемент movedLI (чтоб не возникало дергания)          
            if (movedLI.classList.contains('displaynone')) movedLI.classList.remove('displaynone'); 

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
                          
                if (currLI!==null && c < 9 && currLI.classList.contains("contacts__item")) {  // если нашли родителя LI.contacts__item               
                  
                  if (lastLI!==null && movedLI.getBoundingClientRect().top > lastLI.getBoundingClientRect().top) { // если перемещаемая li ниже всего списка                                     
                    placeUnderUL = true;
                    if (currLI.classList.contains("is_found")) currLI.classList.remove("is_found");
                    lastLI.classList.add("is_found--under");                    
                  }
                  else {                    
                    placeUnderUL = false;
                    if (lastLI.classList.contains("is_found--under")) lastLI.classList.remove("is_found--under");
                    currLI.classList.add("is_found");  // покажем дочерний элемент .contact__dropzone для индикации нового места в списке                     
                  }                  

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

                  // пройдемся по checkedLIs для удаления класса индикации "посадочного" места
                  checkedLIs.forEach( li => {
                    if (li !== currLI) 
                      if (li.classList.contains("is_found")) li.classList.remove("is_found");
                  });                  
                } 
              }
            }
            is_Time = true; // разрешим поиск элементов под координатами (x,y)
          }, timerTouchInterval);                    
        }
      } 
    },

    /*-----------------------------------------------------------------------------
      пользователь прекратил перемещение элемента, переместим элемент (TouchEvent)
    -----------------------------------------------------------------------------*/
    touchEnd(e) {
      let i = 0;

      // отменим действия таймера, если он был запущен в touchmove
      clearTimeout(timerTouch); 

      // определим номер currLI в общем списке всех LI
      for (i = 0; i < parentUL.children.length; i++) {
        if (parentUL.children[i] === currLI) {
          currLINum = i;
          break;
        } else currLINum = -1;
      }
      if (placeUnderUL) currLINum = parentUL.children.length;
      
      if (currLINum >= 0) {
        // если currLINum>currentMovedLiNum и находится по соседству и 
        if (currLINum-currentMovedLiNum >= 1) currLINum--;
        // если номер перемещаемой li === номеру куда нужно переместить эту li, то ничего не делаем
        if (currentMovedLiNum === currLINum) return;
        else {                            
          let tempAllLI = []; // временный массив для хранения 

          // удалим из historyUsersCalls перемещаемую li, предварительно сохранив ее во временную переменную tempHistoryUser
          const tempHistoryUser = this.historyArray[currentMovedLiNum];
          this.historyArray.splice(currentMovedLiNum, 1);

          // заполним временный массив частями: [0..то место куда перемещаем-1], [перемещаемый элемент], [все оставшееся]
          for (i=0; i < currLINum; i++) tempAllLI.push(this.historyArray[i]); 
          tempAllLI.push(tempHistoryUser);
          for (i = currLINum + 1; i < this.historyArray.length+1; i++) tempAllLI.push(this.historyArray[i-1]);         
                    
          // обновим получившийся массив historyUsersCalls с историей звонков
          this.historyArray = [...tempAllLI];
        }
      }

      // вернем сво-во position перемещаемой li
      if (movedLI.classList.contains("is_moved")) movedLI.classList.remove("is_moved"); 
      // вернем сво-во top в первоначальное положение перемещаемой li
      movedLI.style.top = "initial"; 

      // уберем все индикации из пройденных li-шек
      checkedLIs.forEach( li => {
          if (li.classList.contains("is_found")) li.classList.remove("is_found");
      });  
      if (lastLI.classList.contains('is_found--under')) lastLI.classList.remove("is_found--under");

      this.$emit('itemMoved',this.historyArray);
    },

    // форматируем номер телефона
    formatingPhoneNumber(number) {
      return transformPhoneNumber(number);
    }
  }
};
</script>
