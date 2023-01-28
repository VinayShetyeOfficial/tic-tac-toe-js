window.onload = function() {

   /*--- Predefined Symbols ---*/
   var symbl_X = 'X';
   var symbl_O = 'O';

   /*--- Setting player Symbols ---*/
   var userSymbl;
   var compSymbl;

   /*--- Button elements ---*/
   var symbolButtons = document.querySelectorAll('.symbl-btn');

   /*--- Elements ---*/
   var symbols = document.querySelectorAll('.symbol');
   var overlay = document.getElementById('overlay');
   var modal = document.getElementById('modal');
    
   /*--- Storing moves ---*/
   var moves = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
   ]; 
    
   var aMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Available moves

   var compPlayed = false;
   /*--- To end game ---*/ 
   var endGame = false; 
    
   /*--- Disabling/Enabling pointer events of layout box on window-load/modal-close ---*/
   function setPointerEvents(val) {
       symbols.forEach(function(block){
           block.style.pointerEvents = val;
       });
   } 
    
   /*--- Open modal dialog on window load ---*/
   function openModal() {
      setPointerEvents('none');
      setTimeout(function() {
         overlay.style.display = 'block';
      }, 800);
   }

   /*--- Close modal dialog on symbol choice ---*/
   function closeModal() {
      modal.style.animation = 'closeModal .3s linear forwards';
      setTimeout(function() {
         overlay.style.display = 'none';
      }, 400);
   }

   /*--- Setting the user and computer symbol ---*/
   function setSymbols() {

      for (var i = 0; i < symbolButtons.length; i++) {
         
         symbolButtons[i].onclick = function() {

            if (this.innerHTML == 'X') {
               userSymbl = symbl_X;
               compSymbl = symbl_O;
            } 
            else {
               userSymbl = symbl_O;
               compSymbl = symbl_X;
            }
            closeModal();
            setPointerEvents('auto');
            hoverBoard();
            bot();
         }
      }
   }
    
   /*--- Symbol placement assist ---*/
   function hoverBoard() {

      for (var i = 0; i < symbols.length; i++) {
         span = document.createElement('span');
         span.innerHTML = userSymbl;
         symbols[i].appendChild(span);
      }
   }
    
   /*--- Update Moves in moves array ---*/
   function updateMoves(r, c, symbl) {

      moves[r][c] = symbl;

      if (symbl == userSymbl) {
         console.log('User');
         console.log('----');
      } 
      else {
         console.log('Computer');
         console.log('--------');
      }

      console.log('Index: [' + r + ', ' + c + ']');
      console.log('Strd Mvs: [' + moves[0] + '] , [' + moves[1] + '] , [' + moves[2] + ']');
      console.log('Avbl Mvs: ' + aMoves + "\n\n");
      console.log('Board');
   }
    
    

   /*--- Blinking Victory Symbol ---*/
   function victory(blck1, blck2, blck3) {

      symbols[blck1].classList.add('blink');
      symbols[blck2].classList.add('blink');
      symbols[blck3].classList.add('blink');

   }

    
    
   /*--- Detecting Winner ---*/
   function winner(x) {
       
      console.log(`${x[0].join(' ')}\n${x[1].join(' ')}\n${x[2].join(' ')}` + '\n\n');

      winners = new Set();

      // columns check
      for (let i = 0; i < 3; i++) {

         if (x[0][i] !== "" && (new Set([x[0][i], x[1][i], x[2][i]])).size === 1) {
            winners.add(x[0][i]);
            victory((0 * 2 + (0 + i)), (1 * 2 + (1 + i)), (2 * 2 + (2 + i)));
         }
      }

      // rows check
      for (let i = 0; i < 3; i++) {

         if (x[i][0] !== "" && (new Set(x[i])).size === 1) {
            winners.add(x[i][0]);
            victory((i * 2 + (i + 0)), (i * 2 + (i + 1)), (i * 2 + (i + 2)));
         }
      }

      // diagonals check
      if (x[1][1] !== "") {

         if ((new Set([x[0][0], x[1][1], x[2][2]])).size === 1) {
            winners.add(x[1][1]);
            victory((0 * 2 + (0 + 0)), (1 * 2 + (1 + 1)), (2 * 2 + (2 + 2)));
         } 
         else if ((new Set([x[0][2], x[1][1], x[2][0]])).size === 1) {
            winners.add(x[1][1]);
            victory((0 * 2 + (0 + 2)), (1 * 2 + (1 + 1)), (2 * 2 + (2 + 0)));
         }
      }

      let text = '';
      winners.forEach(function(value) {
         text += value + '<br>';
      });

      if (winners.size === 2) {
         return "error";
      }

      if (winners.size === 0) {
         // completion check
         if (x.every(y => y.every(z => z))) {
            return "draw";
         }

         return "incomplete";
      }

      return winners.values().next().value;
   }
    
    

   /*--- Game Status ---*/
   function checkStatus() {

      var status = winner(moves);

      console.log("Message: " + status + "\n\n\n");

      if (status === userSymbl || status === compSymbl || status === 'draw') {
          endGame = true;
          setPointerEvents('none');
          setTimeout(reset, 2500); 
      } 
//       else if (status === compSymbl) {
//
//          endGame = true;
//          layout.style.pointerEvents = 'none';
//          
//      }
   }

    
    
   /*--- Bot Player (Dumbo) ---*/
   function bot() {
       
      var index = Math.floor(Math.random() * aMoves.length);
      var r = symbols[aMoves[index]].getAttribute('r') * 1;
      var c = symbols[aMoves[index]].getAttribute('c') * 1;
       
      symbols[aMoves[index]].innerHTML = compSymbl;
      symbols[aMoves[index]].style.pointerEvents = 'none';

      aMoves.splice(aMoves.indexOf(aMoves[index]), 1);

      updateMoves(r, c, compSymbl);
      checkStatus();
       
      compPlayed = true;
   }

    
    
   /*--- Game Box event Listeners ---*/
   function gameBox() {

      for (var i = 0; i < symbols.length; i++) {

         symbols[i].addEventListener('click', function() {

                if(compPlayed){
                    var r = this.getAttribute('r') * 1;
                    var c = this.getAttribute('c') * 1;
                    var blockNo = r * 2 + (r + c);

                    this.innerHTML = userSymbl;
                    this.style.pointerEvents = 'none';
                    aMoves.splice(aMoves.indexOf(blockNo), 1);

                    updateMoves(r, c, userSymbl);
                    checkStatus();

                    if(!endGame){ 
                        console.log('Player area');
                        setTimeout(bot, 300);
                    }
                    
                    compPlayed = false;
             }    
         });
      }
   }

   function reset(){
       
       moves = [
          ['', '', ''],
          ['', '', ''],
          ['', '', '']
        ]; 
    
       aMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
       
       endGame = false;
       winners = new Set();
       
       for(var i=0; i<symbols.length; i++){ 
           symbols[i].innerHTML = '';
           symbols[i].classList.remove('blink');
       }
       
       setPointerEvents('auto');
       hoverBoard();
       compPlayed = false;
       bot();
   }
    
   /*--- Main function ---*/
   function init() {
      openModal();
      setSymbols();
      gameBox();
   }
   init();
}