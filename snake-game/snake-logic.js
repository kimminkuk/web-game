const GameState = {
    level: 'EASY', // EASY, MEDIUM, HARD
    snakeSpeed: 200, // milliseconds between moves
    score: 0,
    EASY: 20,
    MEDIUM: 18,
    HARD: 15,
    mouseSpeed: 500,
};

const SnakeState = {
    direction: 'RIGHT', // RIGHT, LEFT, UP, DOWN
    nextDirection: 'RIGHT',
    head: [{ x: 3, y: 0 }], // Initial position of the snake head, Randomly placed
    body: [{ x: 2, y: 0 }, { x: 1, y: 0 }], // Initial position of the snake, Randomly placed
    length: 3, // Initial length of the snake
}

const SnakeInitialPosition = {
    head: [{ x: 3, y: 0 }], // Initial position of the
    body: [{ x: 2, y: 0 }, { x: 1, y: 0 }], // Initial position of the snake body
}

const MouseState = {
    direction: 'RIGHT', // RIGHT, LEFT, UP, DOWN
    nextDirection: 'RIGHT',
    position: { x: 0, y: 0 }, // Initial position of the mouse, Randomly placed
}

const MouseInitialPosition = {
    position: { x: 0, y: 0 }, // Initial position of the mouse, Randomly placed
}

let snakeIntervalState = {
    isRunning: false, // Snake의 움직임이 실행 중인지 여부
    intervalId: null, // Snake의 움직임을 위한 Interval ID
};
let mouseIntervalState = {
    isRunning: false, // Mouse의 움직임이 실행 중인지 여부
    intervalId: null, // Mouse의 움직임을 위한 Interval ID
};

function SnakeDieCheck() {
    // Snake가 움직일 때마다, 체크한다.
    // Snake의 body가 벽에 닿았는지 확인한다.
    // 벽에 닿으면 죽는다.
    let rightWallLength = GameState.EASY; // Easy level width
    let topLength = GameState.EASY; // Easy level height

    if (GameState.level === 'EASY') {
        rightWallLength = GameState.EASY;
        topLength = GameState.EASY;
    } else if (GameState.level === 'MEDIUM') {
        rightWallLength = GameState.MEDIUM;
        topLength = GameState.MEDIUM;
    }
    else if (GameState.level === 'HARD') {
        rightWallLength = GameState.HARD;
        topLength = GameState.HARD;
    } else {
        console.error('[SnakeDieCheck] Invalid game level');
        return;
    }

    const head = SnakeState.head[0];
    
    // 벽에 닿았는지 확인한다.
    if (head.x < 0 || head.x >= rightWallLength || head.y < 0 || head.y >= topLength) {
        console.log('[SnakeDieCheck] Snake died by hitting the wall');
        gameOver(); // 게임 오버
        return;
    }
}

function initializedMousePosition() {
    // Mouse의 위치를 초기화 한다.
    // Mouse는 Snake와 겹치지 않는 위치에 초기화한다.
    // 게임 난이도에 따라서 위치가 달라진다.
    // easy는 20x20, medium은 18x18, hard는 15x15이다.
    let rightWallLength = GameState.EASY; // Easy level width
    let topLength = 20; // Easy level height
    let topPosition = 0;
    if (GameState.level === 'EASY') {
        rightWallLength = GameState.EASY;
        topLength = GameState.EASY;
    } else if (GameState.level === 'MEDIUM') {
        rightWallLength = GameState.MEDIUM;
        topLength = GameState.MEDIUM;
    }
    else if (GameState.level === 'HARD') {
        rightWallLength = GameState.HARD;
        topLength = GameState.HARD;
    } else {
        console.error('[initializedMousePosition] Invalid game level');
        return;
    }

    // top Random position
    const rowPosition = Math.floor(Math.random() * (topLength)); // 0 ~ topLength-1
    // head Random position
    const colPosition = Math.floor(Math.random() * (rightWallLength)); // 0 ~ rightWallLength-1

    // Mouse의 위치가 Snake의 위치와 겹치지 않도록 한다.
    // Snake의 위치는 SnakeInitialPosition.head와 SnakeInitialPosition.body에 저장되어 있다.
    const snakePositions = [...SnakeState.head, ...SnakeState.body];
    let isSnakePosition = snakePositions.some(pos => pos.x === colPosition && pos.y === rowPosition);
    
    // 만약, Mouse의 위치가 Snake의 위치와 겹치면, 다시 랜덤으로 설정한다.
    while (isSnakePosition) {
        rowPosition = Math.floor(Math.random() * (topLength)); // 0 ~ topLength-1
        colPosition = Math.floor(Math.random() * (rightWallLength)); // 0 ~ rightWallLength-1
        isSnakePosition = snakePositions.some(pos => pos.x === colPosition && pos.y === rowPosition);
    }

    MouseInitialPosition.position = { x: colPosition, y: rowPosition };
    console.log(`[initializedMousePosition] Mouse initial position set to: ${JSON.stringify(MouseInitialPosition.position)}`);
}

function initializedSnakePosition() {
    // Snake의 길이는 3.
    // 처음에는 항상 Right 방향으로 시작한다.    
    // 그리고, 벽에 body가 닿으면 죽는다.
    // 따라서, Snake의 body는 벽에 닿지 않는 위치에 초기화한다.
    // 게임 난이도에 따라서 위치가 달라진다.
    // easy는 20x20, medium은 18x18, hard는 15x15이다.

    // 왼쪽 벽에서 +2, 오른쪽 벽에서 -4 (-3이면 바로 벽 맞음)

    let leftWallOffset = 2;
    let rightWallOffset = 4;
    let rightWallLength = GameState.EASY; // Easy level width
    let topLength = GameState.EASY; // Easy level height
    let topPosition = 0;
    let headPosition = 3;

    if (GameState.level === 'EASY') {
        rightWallLength = GameState.EASY;
        topLength = GameState.EASY;
    } else if (GameState.level === 'MEDIUM') {
        rightWallLength = GameState.MEDIUM;
        topLength = GameState.MEDIUM;
    }
    else if (GameState.level === 'HARD') {
        rightWallLength = GameState.HARD;
        topLength = GameState.HARD;
    } else {
        console.error('[initializedSnakePosition] Invalid game level');
        return;
    }

    // top Random position
    topPosition = Math.floor(Math.random() * (topLength)); // 1 ~ topLength-1
    // head Random position
    headPosition = Math.floor(Math.random() * (rightWallLength - leftWallOffset - rightWallOffset)) + leftWallOffset; // 2 ~ rightWallLength-4

    SnakeState.head = [{ x: headPosition, y: topPosition }];
    SnakeState.body = [
        { x: headPosition - 1, y: topPosition },
        { x: headPosition - 2, y: topPosition }
    ]
    console.log(`[initializedSnakePosition] Snake initial position set to head: ${JSON.stringify(SnakeInitialPosition.head)}, body: ${JSON.stringify(SnakeInitialPosition.body)}`);
}

function initializedGame() {
    GameState.level = 'EASY';
    GameState.snakeSpeed = 200;
    GameState.mouseSpeed = 500;
    GameState.score = 0;

    SnakeState.direction = 'RIGHT';
    SnakeState.nextDirection = 'RIGHT';
    SnakeState.length = 3;
    SnakeState.head = [{ x: 3, y: 0 }]; // Initial position of the snake head, Randomly placed
    SnakeState.body = [{ x: 2, y: 0 }, { x: 1, y: 0 }]; // Initial position of the snake, Randomly placed
}

function gameStateSetLevel(level) {
    // 게임 난이도를 설정한다.
    // level은 'EASY', 'MEDIUM', 'HARD' 중 하나이다.

    // level 대소문자 구분안하기 위해서,
    // level을 대문자로 변환한다.
    if (typeof level !== 'string' || level.length === 0 || !['EASY', 'MEDIUM', 'HARD'].includes(level.toUpperCase())) {
        console.error('[gameStateSetLevel] Invalid game level type');
        return;
    }
    level = level.toUpperCase();

    if (level === 'EASY') {
        GameState.level = 'EASY';
        GameState.snakeSpeed = 200;
    } else if (level === 'MEDIUM' || level === 'medium') {
        GameState.level = 'MEDIUM';
        GameState.snakeSpeed = 100;
    } else if (level === 'HARD') {
        GameState.level = 'HARD';
        GameState.snakeSpeed = 50;
    } else {
        console.error('[gameStateSetLevel] Invalid game level');
    }
}

function moveMouse() {

}

function moveSnake() {
    const head = SnakeState.head[0]; 
    let nextHead;
    let nextBody;

    // Snake의 방향에 따라 새로운 Head 위치를 계산한다.
    switch (SnakeState.direction) {
        case 'UP':
            nextHead = { x: head.x, y: head.y - 1 };
            nextBody = [0, -1];
            break;
        case 'DOWN':
            nextHead = { x: head.x, y: head.y + 1 };
            nextBody = [0, 1];
            break;
        case 'LEFT':
            nextHead = { x: head.x - 1, y: head.y };
            nextBody = [-1, 0];
            break;
        case 'RIGHT':
            nextHead = { x: head.x + 1, y: head.y };
            nextBody = [1, 0];
            break;
        default:
            console.error('[moveSnake] Invalid snake direction');
            return; 
    }
    SnakeState.head.unshift(nextHead); // 새로운 Head를 추가한다.
    for (let i = SnakeState.body.length - 1; i >= 0; i--) {
        SnakeState.body[i].x += nextBody[0]; // Body의 위치를 업데이트한다.
        SnakeState.body[i].y += nextBody[1]; 
    }
    
    displayMoveSnake(); // Snake를 다시 그린다.
    
    SnakeDieCheck(); // Snake가 죽었는지 확인한다.
}

function growSnake() {
    const tail = SnakeState.body[SnakeState.body.length - 1];
    // Snake의 길이를 늘린다.
    SnakeState.body.push({ ...tail}); //바디의 마지막 부분을 복사합니다.
    SnakeState.length += 1;
    
    console.log(`[growSnake] Snake grew to length: ${SnakeState.length}`);
}

function displaySnake() {
    const gameCanvas = document.getElementById('game-canvas');

    // Snake의 Head, Body를 가져온다.
    const snakeHeadPosition = SnakeState.head; // Initial position of the snake head
    const snakeBodyPositions = SnakeState.body; // Initial position of the snake body
    SnakeState
    // 기존 Snake 초기화
    const cells = gameCanvas.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.classList.remove('snake-head', 'snake-body');
    });

    const gridSize = GameState.level === 'EASY' ? GameState.EASY : GameState.level === 'MEDIUM' ? GameState.MEDIUM : GameState.HARD;

    // Snake의 Head를 그린다.
    const headCell = cells[snakeHeadPosition[0].y * gridSize + snakeHeadPosition[0].x]; // Assuming 20x20 grid
    headCell.classList.add('snake-head');

    // Snake의 Body를 그린다.
    snakeBodyPositions.forEach((bodyPosition, index) => {
        const bodyCell = cells[bodyPosition.y * gridSize + bodyPosition.x]; // Assuming 20x20 grid
        bodyCell.classList.add('snake-body');
    });

}

function displayMoveSnake() {
    const gameCanvas = document.getElementById('game-canvas');
    const gridSize = GameState.level === 'EASY' ? GameState.EASY : GameState.level === 'MEDIUM' ? GameState.MEDIUM : GameState.HARD;
    const cells = gameCanvas.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.classList.remove('snake-head', 'snake-body');
    });    

    // Snake의 Head를 그린다.
    const headCell = cells[SnakeState.head[0].y * gridSize + SnakeState.head[0].x];
    headCell.classList.add('snake-head');
    
    // Snake의 Body를 그린다.
    SnakeState.body.forEach((bodyPosition, index) => {
        const bodyCell = cells[bodyPosition.y * gridSize + bodyPosition.x];
        bodyCell.classList.add('snake-body');
    });

    console.log(`[displayMoveSnake] Snake moved to head: ${JSON.stringify(SnakeState.head[0])}, body: ${JSON.stringify(SnakeState.body)}`);
}

function displayMouse() {
    // 먹이를 그린다.
    // 먹이는 game-canvas에 그린다.
    const gameCanvas = document.getElementById('game-canvas');

    // 기존 먹이 초기화
    const cells = gameCanvas.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.classList.remove('mouse');
    });

    // 먹이 위치를 랜덤으로 설정한다.
    const gridSize = GameState.level === 'EASY' ? GameState.EASY : GameState.level === 'MEDIUM' ? GameState.MEDIUM : GameState.HARD;    
    const mouseX = Math.floor(Math.random() * gridSize);
    const mouseY = Math.floor(Math.random() * gridSize);

    // 먹이 셀을 찾는다.
    const mouseCell = cells[mouseY * gridSize + mouseX];
    mouseCell.classList.add('mouse');
    mouseCell.innerHTML = '🐭';

    // Mouse 이모티콘 크기가 조금 커서, cells가 어색해짐
    if (GameState.level === 'EASY') {
        mouseCell.style.fontSize = '0.7em'; // Easy level, slightly larger
    } else if (GameState.level === 'MEDIUM') {
        mouseCell.style.fontSize = '0.8em'; // Medium level, normal size
    } else if (GameState.level === 'HARD') {
        mouseCell.style.fontSize = '1.0em'; // Hard level, smaller size
    }

    console.log(`[displayMouse] Mouse displayed at position: (${mouseX}, ${mouseY})`);
}

function displayCanvas() {
    // canvas를 그린다.
    // canvas는 game-canvas에 그린다.
    const gameCanvas = document.getElementById('game-canvas');
    const gridSize = GameState.level === 'EASY' ? GameState.EASY : GameState.level === 'MEDIUM' ? GameState.MEDIUM : GameState.HARD;
    if (!gameCanvas) {
        console.error('[displayCanvas] Game canvas not found');
        return;
    }

    // 기존 canvas 내용 지우기
    gameCanvas.innerHTML = '';

    // CSS Grid 설정
    gameCanvas.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    gameCanvas.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    // 칸 생성
    for (let i = 0 ; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.style.width = '100%';
        cell.style.height = '100%';
        gameCanvas.appendChild(cell);
    }
}

function gameStart(level) {
    console.log(`[gameStart] Game started with level: ${level}`);

    // 게임 상태를 초기화한다.
    initializedGame();

    // 게임 난이도 설정
    gameStateSetLevel(level);

    // 화면을 그린다.
    // 게임화면은 game-canvas에 그린다.
    displayCanvas();

    // 게임 시작 시, Snake의 위치를 초기화한다.
    initializedSnakePosition();

    // Snake를 그린다.
    displaySnake();

    initializedMousePosition();
    // 먹이를 그린다.
    displayMouse();

    snakeIntervalState.intervalId = setInterval(moveSnake, GameState.snakeSpeed);
    mouseIntervalState.intervalId = setInterval(moveMouse, GameState.mouseSpeed);

    // Snake의 움직임을 시작한다.
    // setInterval() 함수를 사용하여 Snake의 움직임을 구현한다.
    // Snake의 움직임은 GameState.speed에 따라 결정된다.
}
function stopGame() {
    clearInterval(snakeIntervalState.intervalId);
    clearInterval(mouseIntervalState.intervalId);
    console.log('[stopGame] Game stopped');
}

function gameOver() {
    
    stopGame();

    console.log('[gameOver] Game Over triggered');
    alert(`Game Over! Your Score: ${GameState.score}`); // 게임 오버 알림

    const gameCanvas = document.getElementById('game-canvas');
    if (gameCanvas) {
        gameCanvas.innerHTML = ''; // 게임 화면 초기화
    }

    // "다시 시작" 버튼 추가
    const buttonContainer = document.getElementById('button-container');
    if (buttonContainer) {
        const restartButton = document.createElement('button');

        restartButton.textContent = 'Restart Game';
        restartButton.style.display = 'block'; // Restart 버튼 표시
        restartButton.style.margin = '20px auto';
        restartButton.style.padding = '10px 20px';
        restartButton.style.fontSize = '1.2em';
        restartButton.style.cursor = 'pointer';        
        
        // 버튼 클릭 시 게임 재시작
        restartButton.addEventListener('click', () => {
            console.log('[gameOver] Restarting game');
            restartButton.remove(); // Restart 버튼 제거
            gameStart(GameState.level); // 게임 재시작
        });
        buttonContainer.appendChild(restartButton);
    }
}

// 방향키 이벤트 리스터 추가
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            SnakeState.direction = 'UP';
            break;
        case 'ArrowDown':
            SnakeState.direction = 'DOWN';
            break;
        case 'ArrowLeft':
            SnakeState.direction = 'LEFT';
            break;
        case 'ArrowRight':
            SnakeState.direction = 'RIGHT';
            break;
        default:
            console.log(`[keydown] Invalid key: ${event.key}`);
    }
});