let main = () => {
let arr = []; //create array, that keeps canvas data image
let draggable = null; // create object, that keeps copy of drag&drop element

let SetStyle = (elem1, elem2) => { // set style of drag&drop elements
    elem1.style.borderStyle = 'solid';
    elem1.style.opacity = '1';
    elem2.style.borderStyle = 'solid';
    elem2.style.opacity = '1';
}

let checkWin = () => { //user win, when .puzzle canvas id === .canvases canvas id
    let puzzles = document.querySelectorAll('.puzzle canvas'); 
    let str;
    for(let i = 0; i < puzzles.length; ++i){
        str = puzzles[i].id;
        if(str[0] !== str[1]){
            return false;
        }
    }
    return true;
}

let dragStart = (ev) => { // function handles ondragstartevent
    ev.dataTransfer.effectAllowed='move'; //set drag&drop effect
    draggable = ev.target; //initialize draggable variable with drag&drop element
    ev.dataTransfer.setDragImage(ev.target,250,250); //save drag&drop element as dataTransfer object
}

let dragEnter = (event) => {
    event.preventDefault(); // cancel event to disable default browser behavior
}


let dragOver = (event) => {
    event.preventDefault(); // cancel event to disable default browser behavior
  }

let dragDrop = (event) => { // swap elements
    let canvases = document.querySelectorAll('.canvas canvas');
    const e = event;
    SetStyle(draggable, e.target);
    const img = new Image();
    const img2 = new Image();
    img2.src = event.target.toDataURL();
    img.src = draggable.toDataURL();
    img.onload = () => {
      event.target.getContext('2d').drawImage(img, 0, 0);
    };
    if(draggable.parentNode.className === 'canvas'){
        draggable.parentNode.removeChild(draggable);
        event.target.id += `${draggable.id}`;
        if(canvases.length == 1 || canvases.length == 0){
            if(checkWin()){ // check if user win
                document.getElementById('win').style.display = 'block'; // display win label
            } else {
                document.getElementById('failed').style.display = 'block'; //display restart button
            }
        }
    } else {
        img2.onload = () => {
        draggable.getContext('2d').drawImage(img2, 0, 0);
    }
    }
  }


  let restare = () => { // handling clicking on restart button
    let puzzles = document.querySelectorAll('.puzzle canvas');
    for(let i = 0; i < puzzles.length; ++ i){
        puzzles[i].getContext('2d').clearRect(0, 0, 250, 250);
    }
    selectGrid(event); // build Grid
    splitCall();
  }

let setDraggable = () => { // set handles of events
    const canvases = document.querySelectorAll('.canvas canvas');
    const puzzles = document.querySelectorAll('.puzzle canvas');
    for (let i = 0; i < canvases.length; i += 1) {
      canvases[i].addEventListener('dragstart', dragStart, false);
      puzzles[i].addEventListener('dragstart', dragStart, false);

      canvases[i].addEventListener('dragover', dragOver, false);
      puzzles[i].addEventListener('dragover', dragOver, false);

      canvases[i].addEventListener('dragenter', dragEnter, false);
      puzzles[i].addEventListener('dragenter', dragEnter, false);

      canvases[i].addEventListener('drop', dragDrop, false);
      puzzles[i].addEventListener('drop', dragDrop, false);
    }
    document.getElementById('failed').addEventListener('click', restare);
  }

  let checkDifference = (element) => { // answers to not generate the same random number
    let canvases =  document.querySelectorAll('.canvas canvas');
    if(canvases !== null){
        for(let i =0; i< canvases.length; ++i){
            if(+canvases[i].id === element){
                return true;
            }
        }
    }
    return false;
}

function splitCall(){ // call function that splits image
    const num = document.getElementById('grid').options[ document.getElementById('grid').selectedIndex].value;
    split(+num, 500 / (+num));
}

  let split = (num, size) => { // split image on four parts
    document.getElementById('failed').style.display = 'none';
    document.getElementById('win').style.display = 'none';
    const canvas = document.getElementById('real');
    const container = document.querySelector('.canvas');
    container.innerHTML = ' ';// clean puzzes
    let w2 = size;
    let h2 = size;
    let length = Math.pow(+num,2);
    let rand = null;
    for(let i = 0; i < (size * num); i += size){
        for(let j = 0; j < (size * num); j += size){
            const canva = document.createElement('canvas');
            const img = canvas.getContext('2d').getImageData(j, i, w2, h2);
            arr.push(img); 

        }
    }
    for(let i = 0; i < arr.length; ++i){
        do{
            rand = 0 + Math.random() * (arr.length);
            rand = Math.floor(rand); //generate random index of image part
        }while(checkDifference(rand));
        const canva = document.createElement('canvas');
        canva.id = ' ';
        canva.id = rand;
        canva.width = size;
        canva.height = size;
        canva.draggable = true;
        container.appendChild(canva); // add puzzles
        canva.getContext('2d').putImageData(arr[rand], 0, 0);

    }
    arr = [];
    setDraggable();
}


let select = (event) => { // handle select button click
    const reader = new FileReader();
    const canvas = document.getElementById('real');
    reader.readAsDataURL(document.getElementById('load').files[0]); // read image
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height); // draw picture on canvas
            splitCall();
        }
    };
    selectGrid(event);
}

function selectGrid(event){ // handle choosing grid size
    event.preventDefault();
    let num = document.getElementById('grid').options[ document.getElementById('grid').selectedIndex].value;
    buildGrid(+num, 500/(+num));
}

function buildGrid(grid, size){ // create grid
    const puzzles = document.querySelector('.puzzle');
    puzzles.innerHTML = ' ';
    const number = Math.pow(grid, 2);
    document.body.style.setProperty('--span', grid);
    document.body.style.setProperty('--size', `${size}px`);
    for(let i = 0; i < number; ++i){
        let canvas = document.createElement('canvas');
        canvas.id = i;
        canvas.width = size;
        canvas.height = size;
        canvas.draggable = true;
        puzzles.appendChild(canvas);
    }
    if(document.querySelector('.canvas').innerHTML !== ' '){
        split(Math.sqrt(grid, 2), size);
    }
}

window.onload = () => {
    document.getElementById('load').addEventListener('change', select);
    document.getElementById('grid').addEventListener('click', selectGrid);
    buildGrid(2, 250); // initialize grid 2 X 2
}
}

main();
