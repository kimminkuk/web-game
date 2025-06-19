const GameState = {
    level: 'EASY', // EASY, MEDIUM, HARD
    speed: 200, // milliseconds between moves
    score: 0,
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

function SnakeDieCheck() {
    // Snake가 움직일 때마다, 체크한다.
    // Snake의 body가 벽에 닿았는지 확인한다.
    // 벽에 닿으면 죽는다.
}

function initializedSnakePosition() {
    // Snake의 길이는 3.
    // 처음에는 항상 Right 방향으로 시작한다.    
    // 그리고, 벽에 body가 닿으면 죽는다.
    // 따라서, Snake의 body는 벽에 닿지 않는 위치에 초기화한다.
    // 게임 난이도에 따라서 위치가 달라진다.
    // easy는 20x20, medium은 18x18, hard는 15x15이다.

    // 왼쪽 벽에서 +3, 오른쪽 벽에서 -4 (-3이면 바로 벽 맞음)

    let leftWallOffset = 3;
    let rightWallOffset = 4;
    let rightWallLength = 20; // Easy level width
    let topLength = 20; // Easy level height
    let topPosition = 0;
    let headPosition = 3;

    if (GameState.level === 'EASY') {
        rightWallLength = 20;
        topLength = 20;
    } else if (GameState.level === 'MEDIUM') {
        rightWallLength = 18;
        topLength = 18;
    }
    else if (GameState.level === 'HARD') {
        rightWallLength = 15;
        topLength = 15;
    } else {
        console.error('[initializedSnakePosition] Invalid game level');
        return;
    }

    // top Random position
    topPosition = Math.floor(Math.random() * (topLength)); // 1 ~ topLength-1
    // head Random position
    headPosition = Math.floor(Math.random() * (rightWallLength - leftWallOffset - rightWallOffset)) + leftWallOffset; // 3 ~ rightWallLength-4

    SnakeInitialPosition.head = [{ x: headPosition, y: topPosition }];
    SnakeInitialPosition.body = [
        { x: headPosition - 1, y: topPosition },
        { x: headPosition - 2, y: topPosition }
    ]
    console.log(`[initializedSnakePosition] Snake initial position set to head: ${JSON.stringify(SnakeInitialPosition.head)}, body: ${JSON.stringify(SnakeInitialPosition.body)}`);
}

function initializedGame() {
    GameState.level = 'EASY';
    GameState.speed = 200;
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
        GameState.speed = 200;
    } else if (level === 'MEDIUM' || level === 'medium') {
        GameState.level = 'MEDIUM';
        GameState.speed = 300;
    } else if (level === 'HARD') {
        GameState.level = 'HARD';
        GameState.speed = 400;
    } else {
        console.error('[gameStateSetLevel] Invalid game level');
    }
}

function moveSnake() {
    
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
    const snakeHeadPosition = SnakeInitialPosition.head; // Initial position of the snake head
    const snakeBodyPositions = SnakeInitialPosition.body; // Initial position of the snake body

    // 기존 Snake 초기화
    const cells = gameCanvas.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.classList.remove('snake-head', 'snake-body');
    });

    const gridSize = GameState.level === 'EASY' ? 20 : GameState.level === 'MEDIUM' ? 18 : 15;

    // Snake의 Head를 그린다.
    const headCell = cells[snakeHeadPosition[0].y * gridSize + snakeHeadPosition[0].x]; // Assuming 20x20 grid
    headCell.classList.add('snake-head');

    // Snake의 Body를 그린다.
    snakeBodyPositions.forEach((bodyPosition, index) => {
        const bodyCell = cells[bodyPosition.y * gridSize + bodyPosition.x]; // Assuming 20x20 grid
        bodyCell.classList.add('snake-body');
    });

}

function displayCanvas() {
    // canvas를 그린다.
    // canvas는 game-canvas에 그린다.
    const gameCanvas = document.getElementById('game-canvas');
    const gridSize = GameState.level === 'EASY' ? 20 : GameState.level === 'MEDIUM' ? 18 : 15;
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

    // 게임 시작 시, Snake의 위치를 초기화한다.
    initializedSnakePosition();

    // 화면을 그린다.
    // 게임화면은 game-canvas에 그린다.
    displayCanvas();

    // Snake를 그린다.
    displaySnake();

    // 게임 상태를 초기화한다.
    

    // Snake의 움직임을 시작한다.
    // setInterval() 함수를 사용하여 Snake의 움직임을 구현한다.
    // Snake의 움직임은 GameState.speed에 따라 결정된다.
}

function gameOver() {
    // 게임 오버 시, Snake의 상태를 초기화한다.
    initializedGame();
    // 게임 오버 메시지를 출력한다.
    console.log('Game Over');
}