// Obs.: Eu teria que dar uma refatorada no código, principalmente nas funções
// checkGoX, já que elas repetem várias vezes a mesma coisa. A solução seria criar
// uma função diferente para checkGrid e checkColision tanto para obstáculos quanto outros rovers
// A solução dos checkColisions seria passar os parâmetros (-10 ou +10) e, caso seja positivo ou
// negativo, compara se seria menor que 0 ou maior que 100.

window.onload = function () {
    // VARIABLES

    // Inserindo rovers
    let rovers = [];
    let obstacles = [];
    let numberRovers = prompt('Insira quantos rovers você deseja inserir no tabuleiro', 'Ex: 15');
    let numberObstacles = prompt('Deseja spawnar obstáculos? Se sim, quantos?', 'Ex: 5');
    let otherRovers;
    let firstRover;
    let currentSelected = 0;
    let lastSelected = 0;
    let indicatorsArr = document.querySelectorAll('.indicators > div'); 
    
    
    createRovers();
    createObstacles();
    insertRovers();
    insertObstacles();

    // EVENT LISTENERS
    document.onkeydown = checkKey;



    // FUNÇÕES AUXILIARES
    function checkKey(e) { // Vou ter que fazer uma função que cheque o movimento X e Y com todos rovers
        switch (e.keyCode) {
            // TURN
            case 37: // left
                if (rovers[currentSelected].roverPointing - 1 >= 0) {
                    rovers[currentSelected].roverPointing -= 1;
                    updateIndicator(rovers[currentSelected].roverPointing + 1, 
                        rovers[currentSelected].roverPointing);
                } else {
                    rovers[currentSelected].roverPointing = 3;
                    updateIndicator(0, rovers[currentSelected].roverPointing);
                }
                break;
            case 39: // right
                if (rovers[currentSelected].roverPointing + 1 <= 3) {
                    rovers[currentSelected].roverPointing += 1;
                    updateIndicator(rovers[currentSelected].roverPointing - 1, 
                        rovers[currentSelected].roverPointing);
                } else {
                    rovers[currentSelected].roverPointing = 0;
                    updateIndicator(3, rovers[currentSelected].roverPointing);
                }
                break;

            // MOVEMENT
            case 38: // up
                if (rovers[currentSelected].roverPointing === 0 && checkGoNorth()) {
                    rovers[currentSelected].roverSouthToNorth += 10;
                    updateRoverPos();
                } else if (rovers[currentSelected].roverPointing === 1 && checkGoEast()) {
                    rovers[currentSelected].roverWestToEast += 10;
                    updateRoverPos();
                } else if (rovers[currentSelected].roverPointing === 2 && checkGoSouth()) {
                    rovers[currentSelected].roverSouthToNorth -= 10;
                    updateRoverPos();
                } else if (rovers[currentSelected].roverPointing === 3 && checkGoWest()) {
                    rovers[currentSelected].roverWestToEast -= 10;
                    updateRoverPos();
                }
                break;
            case 40: // down
                if (rovers[currentSelected].roverPointing === 0 && checkGoSouth()) {
                    rovers[currentSelected].roverSouthToNorth -= 10;
                    updateRoverPos();
                } else if (rovers[currentSelected].roverPointing === 1 && checkGoWest()) {
                    rovers[currentSelected].roverWestToEast -= 10;
                    updateRoverPos();
                } else if (rovers[currentSelected].roverPointing === 2 && checkGoNorth()) {
                    rovers[currentSelected].roverSouthToNorth += 10;
                    updateRoverPos();
                } else if (rovers[currentSelected].roverPointing === 3 && checkGoEast()) {
                    rovers[currentSelected].roverWestToEast += 10;
                    updateRoverPos();
                }
                break;            
        }
    }

    // ================================ UPDATE FUNCTIONS ==================================== //

    function updateRoverPos() {
        if (currentSelected === 0) {
            firstRover.style.cssText = `left: ${rovers[currentSelected].roverSouthToNorth}%;
            top: ${rovers[currentSelected].roverWestToEast}%`;
        } else {
            otherRovers[currentSelected - 1].style.cssText = 
            `left: ${rovers[currentSelected].roverSouthToNorth}%;
            top: ${rovers[currentSelected].roverWestToEast}%`;
        }
    }

    function updateIndicator(oldValue, newValue) {
        indicatorsArr[oldValue].classList.toggle('pointing');
        indicatorsArr[newValue].classList.toggle('pointing');
    }

    // ================================ CHECK FUNCTIONS ==================================== //

    function checkGoNorth() {
        let avaiablePath = true;
        // Checking colision with other rovers
        for (let i = 0; i < rovers.length; i++) {
            if (i !== currentSelected) {
                if (rovers[currentSelected].roverSouthToNorth + 10 === rovers[i].roverSouthToNorth
                    && rovers[currentSelected].roverWestToEast === rovers[i].roverWestToEast) {
                    avaiablePath = false;
                    console.log(`You can't simple run above others rovers!!`);
                }
            }
        }
        // Checking colision with obstacles
        for (let i = 0; i < obstacles.length; i++) {
            if (rovers[currentSelected].roverSouthToNorth + 10 === obstacles[i].obstacleSouthToNorth
                && rovers[currentSelected].roverWestToEast === obstacles[i].obstacleWestToEast) {
                avaiablePath = false;
                console.log(`Watch Out!! You bump into an obstacle!`);
            }
        }
        // Checking grid
        if (rovers[currentSelected].roverSouthToNorth + 10 > 100) {
            avaiablePath = false;
            console.log(`Are you trying to kill yourself jumping out of the grid?`);
        }
        return avaiablePath;
    }

    function checkGoEast() {
        let avaiablePath = true;
        // Checking colision with other rovers
        for (let i = 0; i < rovers.length; i++) {
            if (i !== currentSelected) {
                if (rovers[currentSelected].roverWestToEast + 10 === rovers[i].roverWestToEast
                    && rovers[currentSelected].roverSouthToNorth === rovers[i].roverSouthToNorth) {
                    avaiablePath = false;
                    console.log(`You can't simple run above others rovers!!`);
                }
            }
        }
        // Checking colision with obstacles
        for (let i = 0; i < obstacles.length; i++) {
            if (rovers[currentSelected].roverWestToEast + 10 === obstacles[i].obstacleWestToEast
                && rovers[currentSelected].roverSouthToNorth === obstacles[i].obstacleSouthToNorth) {
                avaiablePath = false;
                console.log(`Watch Out!! You bump into an obstacle!`);
            }
        }
        // Checking grid
        if (rovers[currentSelected].roverWestToEast + 10 > 100) {
            avaiablePath = false;
            console.log(`Are you trying to kill yourself jumping out of the grid?`);
        }
        return avaiablePath;
    }

    function checkGoSouth() {
        let avaiablePath = true;
        // Checking colision with other rovers
        for (let i = 0; i < rovers.length; i++) {
            if (i !== currentSelected) {
                if (rovers[currentSelected].roverSouthToNorth - 10 === rovers[i].roverSouthToNorth
                    && rovers[currentSelected].roverWestToEast === rovers[i].roverWestToEast) {
                    avaiablePath = false;
                    console.log(`You can't simple run above others rovers!!`);
                }
            }
        }
        // Checking colision with obstacles
        for (let i = 0; i < obstacles.length; i++) {
            if (rovers[currentSelected].roverSouthToNorth - 10 === obstacles[i].obstacleSouthToNorth
                && rovers[currentSelected].roverWestToEast === obstacles[i].obstacleWestToEast) {
                avaiablePath = false;
                console.log(`Watch Out!! You bump into an obstacle!`);
            }
        }
        // Checking grid
        if (rovers[currentSelected].roverSouthToNorth - 10 < 0) {
            avaiablePath = false;
            console.log(`Are you trying to kill yourself jumping out of the grid?`);
        }
        return avaiablePath;
    }

    function checkGoWest() {
        let avaiablePath = true;
        // Checking colision with other rovers
        for (let i = 0; i < rovers.length; i++) {
            if (i !== currentSelected) {
                if (rovers[currentSelected].roverWestToEast - 10 === rovers[i].roverWestToEast
                    && rovers[currentSelected].roverSouthToNorth === rovers[i].roverSouthToNorth) {
                    avaiablePath = false;
                    console.log(`You can't simple run above others rovers!!`);
                }
            }
        }
        // Checking colision with obstacles
        for (let i = 0; i < obstacles.length; i++) {
            if (rovers[currentSelected].roverWestToEast - 10 === obstacles[i].obstacleWestToEast
                && rovers[currentSelected].roverSouthToNorth === obstacles[i].obstacleSouthToNorth) {
                avaiablePath = false;
                console.log(`Watch Out!! You bump into an obstacle!`);
            }
        }
        // Checking grid
        if (rovers[currentSelected].roverWestToEast - 10 < 0) {
            avaiablePath = false;
            console.log(`Are you trying to kill yourself jumping out of the grid?`);
        }
        return avaiablePath;
    }

    // ================================ CREATE FUNCTIONS ==================================== //

    function generateRnd(lowerRange, higherRange) {
        return Math.floor( lowerRange + Math.random() * (higherRange - lowerRange) );
    }

    function createRovers() {
        if (numberRovers > 100) {
            console.log(`Sorry, this grid doesn't support more than 100 rovers :(`);
            return; 
        }

        for (let i = 0; i < numberRovers; i++) {
            let rwte = generateRnd(0, 10) * 10 + 5;
            let rstn = generateRnd(0, 10) * 10 + 5;
            let pointing = generateRnd(0, 4);
            let allowUpdate = true;
    
            for (let j = 0; j < rovers.length; j++) {
                if (rovers[j].roverWestToEast === rwte && rovers[j].roverSouthToNorth === rstn) {
                    allowUpdate = false;
                    i--;
                }
            }
    
            if (allowUpdate) {
                rovers.push({
                    value: i,
                    roverWestToEast: rwte,
                    roverSouthToNorth: rstn,
                    roverPointing: pointing
                });
            }
        }
        console.log(rovers);
    }

    function createObstacles() {
        if (parseInt(numberRovers) + parseInt(numberObstacles) > 100) {
            console.log(`Our grid doesn't support this many rovers with obstacles!`);
            return;
        } 

        for (let i = 0; i < numberObstacles; i++) {
            let allowUpdate = true;
            let rwte = generateRnd(0, 10) * 10 + 5;
            let rstn = generateRnd(0, 10) * 10 + 5;

            for (let j = 0; j < rovers.length; j++) {
                if (rwte === rovers[j].roverWestToEast && rstn === rovers[j].roverSouthToNorth) {
                    allowUpdate = false;
                    i--;
                }
            }
    
            if (allowUpdate) {
                obstacles.push({
                    obstacleWestToEast: rwte,
                    obstacleSouthToNorth: rstn,
                });
            }
        }
    }

    // ================================ INSERT FUNCTIONS ==================================== //

    function insertRovers() {
        let fatherDiv = document.querySelector('.board3d');

        for (let i = 0; i < rovers.length; i++) { // Atribuindo classes para os divs
            let appendRover = document.createElement('div');
            let appendFixLeft = document.createElement('div');
            let appendFixRight = document.createElement('div');
            appendFixRight.setAttribute('class', 'rover-fixRight');
            appendFixLeft.setAttribute('class', 'rover-fixLeft');

            if (i === 0) {
                appendRover.setAttribute('class', 'rover-selected');
                appendRover.appendChild(appendFixLeft);
                appendRover.appendChild(appendFixRight);
                fatherDiv.appendChild(appendRover);
                appendRover.innerHTML = i;
            } else {
                appendRover.setAttribute('class', 'rover');
                appendRover.appendChild(appendFixLeft)
                appendRover.appendChild(appendFixRight);
                fatherDiv.appendChild(appendRover);
                appendRover.innerHTML = i;
            }

            if (i === 0) {
                let firstRover = document.querySelector('.rover-selected');
                firstRover.style.cssText = `left: ${rovers[0].roverSouthToNorth}%;
                    top: ${rovers[0].roverWestToEast}%`;
            } else {
                let roversRemaining = document.querySelectorAll('.rover');
                roversRemaining[i - 1].style.cssText = `left: ${rovers[i].roverSouthToNorth}%;
                    top: ${rovers[i].roverWestToEast}%`;
            }
        }

        // ADDING EVENT LISTENER TO ALL ROVERS (CHANGING CLASS -> ROVER TO SELECTED-ROVER)
        firstRover = document.querySelector('.rover-selected');
        otherRovers = document.querySelectorAll('.rover');
        
        firstRover.addEventListener('click', function () {
            if (!firstRover.classList.contains('rover-selected')) {
                let roverSelected = document.querySelector('.rover-selected');
                lastSelected = parseInt(roverSelected.innerHTML);
                firstRover.classList.toggle('rover-selected');
                firstRover.classList.toggle('rover');
                roverSelected.classList.toggle('rover-selected');
                roverSelected.classList.toggle('rover');
                currentSelected = 0;
                updateIndicator(rovers[lastSelected].roverPointing, rovers[currentSelected].roverPointing);
            }
        });

        for (let i = 0; i < rovers.length - 1; i++) {
            otherRovers[i].addEventListener('click', function () {
                let roverSelected = document.querySelector('.rover-selected');
                lastSelected = parseInt(roverSelected.innerHTML);
                roverSelected.classList.toggle('rover-selected');
                roverSelected.classList.toggle('rover');
                this.classList.toggle('rover');
                this.classList.toggle('rover-selected');
                currentSelected = parseInt(this.innerHTML);
                updateIndicator(rovers[lastSelected].roverPointing, rovers[currentSelected].roverPointing); 
            });
        }

        indicatorsArr[rovers[0].roverPointing].classList.toggle('pointing');
    }

    function insertObstacles() {
        let fatherDiv = document.querySelector('.board3d');

        for (let i = 0; i < obstacles.length; i++) { // Atribuindo classes para os divs
            let appendObstacle = document.createElement('div');
            let appendFixLeft = document.createElement('div');
            let appendFixRight = document.createElement('div');
            appendFixRight.setAttribute('class', 'rover-obstacles-fixRight');
            appendFixLeft.setAttribute('class', 'rover-obstacles-fixLeft');

            appendObstacle.setAttribute('class', 'rover-obstacles');
            appendObstacle.appendChild(appendFixLeft)
            appendObstacle.appendChild(appendFixRight);
            fatherDiv.appendChild(appendObstacle);

            let obstaclesRemaining = document.querySelectorAll('.rover-obstacles');
            obstaclesRemaining[i].style.cssText = `left: ${obstacles[i].obstacleSouthToNorth}%;
            top: ${obstacles[i].obstacleWestToEast}%`;
        }
    }
};