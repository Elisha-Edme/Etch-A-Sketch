var sideLength = 52;
var mouseDown = false;
const colors = ['red', 'green', 'blue', 'black', 'white', 'orange', 'yellow', 'aqua', 'maroon', 'lime', 'beige', 'gold', 'deeppink'];
var eraser = false; 
const chooseColor = () => {return colors[Math.floor(Math.random() * (colors.length - 1))]};
var backgroundColor = 'white';
var penColor = 'black';
document.addEventListener('mousedown', () => mouseDown=true);
document.addEventListener('mouseup', () => mouseDown=false);
const changeButton = function () {
    if (mouseDown) 
        this.style.backgroundColor = (eraser ? backgroundColor:penColor);
}

const createBox = () => {
    const box = document.createElement('div');
    box.classList.add(`box`);
    box.addEventListener('mouseover', changeButton);
    return box;
}
const createRow = (size) => {
    const row = document.createElement('div');
    row.classList.add('row');
    for(let i = 1; i <= size; i++)
    {
        row.appendChild(createBox());
    }
    return row;
}
const createBoxes = (size) => {
    const board = document.querySelector('.board');
    for(let i = 1; i <= size; i++)
    {
        board.appendChild(createRow(size));
    }
}
const initializeInput = () => {
    const input = document.querySelector('#side-slider');
    input.value = sideLength;
    const sideLengths = document.querySelectorAll('.side-length');
    sideLengths.forEach((span) => {span.textContent = sideLength});
}
const handleColorClick = function () {
    if (eraser)
    {
        document.querySelector('#eraser').style.animation = 'vibrate 0.1s ease-in-out 2';
        return;
    }
    // get the class
    const color = [...this.classList].filter((value) => colors.includes(value))[0];
    // find if it's a pen or the background
    const isPen = this.parentNode.classList.contains('pen');
    // change appropriate color
    if(isPen) penColor = color;
    else {
        backgroundColor = color;
        document.querySelector('#clear').click();
    }
    
}

const createColor = (color) => {
        // Create a div with class = color-container
        const container = document.createElement('div');
        container.classList.add(`${color}`)
        // insert a div with class = color
        const colorImage = document.createElement('div');
        colorImage.classList.add('color');
        colorImage.style.backgroundColor = `${color}`;
        // insert text with the name of the color
        const colorName = document.createElement('h4');
        colorName.classList.add('color-name');
        colorName.textContent = `${color.toUpperCase()}`;
        container.appendChild(colorImage);
        container.appendChild(colorName);
        return container;
    };
const createColorOptions = () => {
    // Create a container for the color options
    const penColorOptions = document.createElement('div'), backgroundColorOptions = document.createElement('div');
    penColorOptions.classList.add('color-options'); backgroundColorOptions.classList.add('color-options');
    penColorOptions.classList.add('pen'); backgroundColorOptions.classList.add('background');
    // Make a list for player colors (should not have the background color)
    let penColors = colors.filter(color => color!=backgroundColor ) 
    // Make a list for the background colors (should not have the pen color)
    let backgroundColors = colors.filter(color => color!=penColor);
    const addColor = (color, parent) => {
        const container = createColor(color, parent);
        container.addEventListener('click', handleColorClick);
        parent.appendChild(container);
    };
    penColors.forEach((color) => {addColor(color, penColorOptions)}); backgroundColors.forEach((color) => {addColor(color, backgroundColorOptions)});
    const backgroundPenButton = document.querySelector('#background');
    backgroundPenButton.insertAdjacentElement('afterend', backgroundColorOptions);
    backgroundPenButton.insertAdjacentElement('beforebegin', penColorOptions);
}
const createOutlineListener = () => {
    const outlineButton = document.querySelector('#outline');
    outlineButton.addEventListener('click', function () {
        document.querySelectorAll('.box').forEach((box) =>box.classList.toggle('show-outline'));
        if(document.querySelector('.box').classList.contains('show-outline'))
        {
            this.textContent = 'Remove Outline';
        }
        else {
            this.textContent = 'Show Outline';
        }
    } );
}
const createEraseListener = () => {
    const eraserButton = document.querySelector('#eraser');
    eraserButton.addEventListener('click', function() {
        if (eraser)
        {
            eraser = false;
            eraserButton.textContent = 'Erase';
        }
        else
        {
            eraser = true;
            eraserButton.textContent = 'Switch to Pen';
        }
    });
}
const createColorOptionsListener = () => {
    const [penButton, backgroundButton] = document.querySelectorAll('.colors');
    const penColorOptions = document.querySelector('#pen + .color-options'), backgroundColorOptions = document.querySelector('#background + .color-options');
    penButton.addEventListener('click', () => {
        penColorOptions.classList.toggle('show');
        if(penColorOptions.classList.contains('show')) penButton.textContent = 'Hide Pen Color Options';
        else penButton.textContent = 'Show Pen Color Options';
    });
    backgroundButton.addEventListener('click', () => {
        backgroundColorOptions.classList.toggle('show');
        if(backgroundColorOptions.classList.contains('show')) backgroundButton.textContent = 'Hide Background Color Options';
        else backgroundButton.textContent = 'Show Background Color Options';
    });
}

const eraseAnimateReset = () => {
    document.querySelector('#eraser').addEventListener('animationend', function () {
        this.style.animation = '';
    });
}
const createClearListener = () => {
    const clearButton = document.querySelector('#clear');
    clearButton.addEventListener('click', () => {
        document.querySelectorAll('.box').forEach((box) => box.style.backgroundColor = backgroundColor);
        // Turn off Erase button if it's on
        if (eraser)
        {
            eraser = false;
            document.querySelector('#eraser').textContent = 'Erase';
        }
    })
}
const createSliderListener = () => {
    const slider = document.getElementById('side-slider');
  slider.addEventListener('input', (e) => {
    const value = e.target.value;
    // Handle the value change
    const sideLengths = document.querySelectorAll('.side-length');
    sideLengths.forEach((span) => {span.textContent = value});
  });
  slider.addEventListener('mouseup', (e) => {
    if(e.target.value != sideLength)
    {
        const boardList = document.querySelectorAll('.row');
        const editSize = (size) => {
            if(size < sideLength)
            {
                for(let index = size; index < sideLength; index++)
                {
                    boardList[index].remove();
                }
                for (let row = 0; row < size; row++)
                {
                    for(let index = size; index < sideLength; index++)
                    {
                        boardList[row].querySelector(':last-child').remove();
                    }
                }
            }
            else 
            {
                boardList.forEach((row) => {
                    for(let count = 1; count <= size-sideLength; count++)
                    row.appendChild(createBox());
                })
                const board= document.querySelector('.board');
                for(let count = 1; count <= size-sideLength; count++) board.appendChild(createRow(size));
            }
            sideLength=size;
        }
        editSize(e.target.value);
        console.log(document.querySelector('.row').childElementCount);
        const temp = document.querySelector('.board').querySelector(':last-child').parentNode;
        console.log(temp.childElementCount);
        console.log(document.querySelector('.board').childElementCount);
    }
  });
}
createBoxes(sideLength);
createOutlineListener();
createColorOptions();
createColorOptionsListener();
createEraseListener();
createClearListener();
eraseAnimateReset();
createSliderListener();
initializeInput();