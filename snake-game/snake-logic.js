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
    prevDirection: 'RIGHT', // 이전 방향을 저장한다.
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
    speed: 500, // milliseconds between moves
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

    MouseState.position = { x: colPosition, y: rowPosition };
    console.log(`[initializedMousePosition] Mouse initial position set to: ${JSON.stringify(MouseState.position)}`);
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
    // 마우스는 랜덤하게 이동하기로 한다.
    randomDirection = Math.floor(Math.random() * 4); // 0 ~ 3

    checkMouseCollisionWithWall(randomDirection); // 벽에 닿았는지 확인한다.

    checkMouseCollisionWithSnakeBody(randomDirection);

    displayMoveMouse();
}

function checkMouseCollisionWithWall(randomDirection) {
    switch (randomDirection) {
        case 0: // UP
            MouseState.position.y -= 1;
            if (MouseState.position.y < 0) {
                MouseState.position.y = 0; // 벽에 닿으면, 위치를 0으로 설정한다.
            }
            break;
        case 1: // DOWN
            MouseState.position.y += 1;
            if (GameState.level === 'EASY' && MouseState.position.y >= GameState.EASY) {
                MouseState.position.y = GameState.EASY - 1; // 벽에
            } else if (GameState.level === 'MEDIUM' && MouseState.position.y >= GameState.MEDIUM) {
                MouseState.position.y = GameState.MEDIUM - 1; // 벽에
            } else if (GameState.level === 'HARD' && MouseState.position.y >= GameState.HARD) {
                MouseState.position.y = GameState.HARD - 1; // 벽에 닿으면, 위치를 0으로 설정한다.
            }
            break;
        case 2: // LEFT
            MouseState.position.x -= 1;
            if (MouseState.position.x < 0) {
                MouseState.position.x = 0; // 벽에 닿으면, 위치를
                // 0으로 설정한다.
            }
            break;
        case 3: // RIGHT
            MouseState.position.x += 1;
            if (GameState.level === 'EASY' && MouseState.position.x >= GameState.EASY) {
                MouseState.position.x = GameState.EASY - 1; // 벽에
            } else if (GameState.level === 'MEDIUM' && MouseState.position.x >= GameState.MEDIUM) {
                MouseState.position.x = GameState.MEDIUM - 1; // 벽에
            }
            else if (GameState.level === 'HARD' && MouseState.position.x >= GameState.HARD) {
                MouseState.position.x = GameState.HARD - 1; //
                // 벽에 닿으면, 위치를 0으로 설정한다.
            }
            break;
        default:
            console.error('[moveMouse] Invalid random direction');
            return; // 잘못된 방향인 경우, 함수를 종료한다.
    }
}

function checkMouseCollisionWithSnakeBody(randomDirection) {
    switch (randomDirection) {
        case 0: // UP
            for (let i = 0; i < SnakeState.body.length; i++) {
                if (SnakeState.body[i].x === MouseState.position.x && SnakeState.body[i].y === MouseState.position.y - 1) {
                    console.error('[checkMouseCollisionWithSnakeBody] Mouse collision with snake body detected in UP direction');
                    MouseState.position.y += 1; // Mouse가 Snake의 몸에 닿으면, 위치를 아래로 이동한다.
                    return;
                }
            }
            break;
        case 1: // DOWN
            for (let i = 0; i < SnakeState.body.length; i++) {
                if (SnakeState.body[i].x === MouseState.position.x && SnakeState.body[i].y === MouseState.position.y + 1) {
                    console.error('[checkMouseCollisionWithSnakeBody] Mouse collision with snake body detected in DOWN direction');
                    MouseState.position.y -= 1; // Mouse가 Snake의 몸에 닿으면, 위치를 위로 이동한다.
                    return;
                }
            }
            break;
        case 2: // LEFT
            for (let i = 0; i < SnakeState.body.length; i++) {
                if (SnakeState.body[i].x === MouseState.position.x - 1 && SnakeState.body[i].y === MouseState.position.y) {
                    console.error('[checkMouseCollisionWithSnakeBody] Mouse collision with snake body detected in LEFT direction');
                    MouseState.position.x += 1; // Mouse가 Snake의 몸에 닿으면, 위치를 오른쪽으로 이동한다.
                    return;
                }
            }
            break;
        case 3: // RIGHT
            for (let i = 0; i < SnakeState.body.length; i++) {
                if (SnakeState.body[i].x === MouseState.position.x + 1 && SnakeState.body[i].y === MouseState.position.y) {
                    console.error('[checkMouseCollisionWithSnakeBody] Mouse collision with snake body detected in RIGHT direction');
                    MouseState.position.x -= 1; // Mouse가 Snake의 몸에 닿으면, 위치를 왼쪽으로 이동한다.
                    return;
                }
            }
            break;
        default:
            console.error('[checkMouseCollisionWithSnakeBody] Invalid random direction');
            return; // 잘못된 방향인 경우, 함수를 종료한다.
    }
}

function displayMoveMouse() {
    // Mouse를 다시 그린다.
    const gameCanvas = document.getElementById('game-canvas');
    const gridSize = GameState.level === 'EASY' ? GameState.EASY : GameState.level === 'MEDIUM' ? GameState.MEDIUM : GameState.HARD;
    const cells = gameCanvas.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.classList.remove('mouse');
        cell.innerHTML = ''; // 먹이 이모티콘 제거
    });

    // Mouse의 위치를 그린다.
    const mouseCell = cells[MouseState.position.y * gridSize + MouseState.position.x];
    mouseCell.classList.add('mouse');
    mouseCell.innerHTML = '🐭'; // 먹이 이모티콘 추가

    // Mouse 이모티콘 크기가 조금 커서, cells가 어색해짐
    if (GameState.level === 'EASY') {
        mouseCell.style.fontSize = '0.7em'; // Easy level, slightly larger
    } else if (GameState.level === 'MEDIUM') {
        mouseCell.style.fontSize = '0.8em'; // Medium level, normal size
    } else if (GameState.level === 'HARD') {
        mouseCell.style.fontSize = '1.0em'; // Hard level, smaller size
    }

    console.log(`[displayMoveMouse] Mouse moved to position: ${JSON.stringify(MouseState.position)}`);
}

function prohibitSnakeNextMove(prevDirection, curDirection) {
    // Snake의 prevDirection가 Right면, 다음 Move에서 Left는 불가능하게 한다.
    // 만약 prevDirection가 Right인데, curDirection이 Left이면 curDirection을 Right로 변경한다.
    if (prevDirection === 'RIGHT' && curDirection === 'LEFT') {
        console.error('[prohibitSnakeNextMove] Snake cannot move LEFT after moving RIGHT');
        SnakeState.direction = 'RIGHT'; // 다음 Move에서 Right로 이동하도록 한다.
        return 'RIGHT'; // 다음 Move에서 Right로 이동하도록 한다.
    }
    // 만약 prevDirection가 Left면, 다음 Move에서 Right는 불가능하게 한다.
    if (prevDirection === 'LEFT' && curDirection === 'RIGHT') {
        console.error('[prohibitSnakeNextMove] Snake cannot move RIGHT after moving LEFT');
        SnakeState.direction = 'LEFT'; // 다음 Move에서 Left로 이동하도록 한다.
        return 'LEFT'; // 다음 Move에서 Left로 이동하도록 한다.
    }
    // 만약 prevDirection가 Up면, 다음 Move에서 Down은 불가능하게 한다
    if (prevDirection === 'UP' && curDirection === 'DOWN') {
        console.error('[prohibitSnakeNextMove] Snake cannot move DOWN after moving UP');
        SnakeState.direction = 'UP'; // 다음 Move에서 Up로 이동하도록 한다.
        return 'UP'; // 다음 Move에서 Up로 이동하도록 한다.
    }
    // 만약 prevDirection가 Down면, 다음 Move에서 Up은 불가능하게 한다
    if (prevDirection === 'DOWN' && curDirection === 'UP') {
        console.error('[prohibitSnakeNextMove] Snake cannot move UP after moving DOWN');
        SnakeState.direction = 'DOWN'; // 다음 Move에서 Down로 이동하도록 한다.
        return 'DOWN'; // 다음 Move에서 Down로 이동하도록 한다.
    }
}  

function checkSnakeHeadAndBodyCollision(nextHeadPos, direction) {
    switch (direction) {
        case 'UP':
            for (let i = 0; i < SnakeState.body.length; i++) {
                if (SnakeState.body[i].x === nextHeadPos.x && SnakeState.body[i].y === nextHeadPos.y - 1) {
                    console.error('[checkSnakeHeadAndBodyCollision] Up direction collision detected');
                    return false; // Snake가 몸쪽으로 이동하는 경우, 움직이지 않는다.
                }
            }
            break;
        case 'DOWN':
            for (let i = 0; i < SnakeState.body.length; i++) {
                if (SnakeState.body[i].x === nextHeadPos.x && SnakeState.body[i].y === nextHeadPos.y + 1) {
                    console.error('[checkSnakeHeadAndBodyCollision] Down direction collision detected');
                    return false; // Snake가 몸쪽으로 이동하는 경우, 움직이지 않는다.
                }
            }
            break;
        case 'LEFT':
            for (let i = 0; i < SnakeState.body.length; i++) {
                if (SnakeState.body[i].x === nextHeadPos.x - 1 && SnakeState.body[i].y === nextHeadPos.y) {
                    console.error('[checkSnakeHeadAndBodyCollision] Left direction collision detected');
                    return false; // Snake가 몸쪽으로 이동하는 경우, 움직이지 않는다.
                }
            }
            break;
        case 'RIGHT':
            for (let i = 0; i < SnakeState.body.length; i++) {
                if (SnakeState.body[i].x === nextHeadPos.x + 1 && SnakeState.body[i].y === nextHeadPos.y) {
                    console.error('[checkSnakeHeadAndBodyCollision] Right direction collision detected');
                    return false; // Snake가 몸쪽으로 이동하는 경우, 움직이지 않는다.
                }
            }
            break;
        default:
            console.error('[checkSnakeHeadAndBodyCollision] Invalid snake direction');
            return false; // Snake가 몸쪽으로 이동하는 경우, 움직이지 않는다.
    }

    return true; // Snake가 몸쪽으로 이동하지 않는 경우, 움직일 수 있다.
}

function setSnakePrevDirection(direction) {
    // Snake의 이전 방향을 설정한다.
    SnakeState.prevDirection = direction;
}

function setNextHeadPositionInPrevStateDirection(direction) {
    // Snake의 다음 Head 위치를 설정한다.
    // Snake의 방향에 따라 다음 Head 위치를 계산한다.
    switch  (direction) {
        case 'UP':
            return { x: SnakeState.head[0].x, y: SnakeState.head[0].y - 1 };
        case 'DOWN':
            return { x: SnakeState.head[0].x, y: SnakeState.head[0].y + 1 };
        case 'LEFT':
            return { x: SnakeState.head[0].x - 1, y: SnakeState.head[0].y };
        case 'RIGHT':
            return { x: SnakeState.head[0].x + 1, y: SnakeState.head[0].y };
        default:
            console.error('[setNextHeadPostion] Invalid snake direction');
            return null; // 잘못된 방향인 경우, null을 반환한다.
    }
}

function snakeAteMouseCheck() {
    // Snake의 Head가 Mouse의 위치와 겹치는지 확인한다.
    if (SnakeState.head[0].x === MouseState.position.x && SnakeState.head[0].y === MouseState.position.y) {
        console.log('[snakeEatMouseCheck] Snake ate the mouse');
        growSnake(); // Snake를 늘린다.
        displaySnake(); // Snake를 다시 그린다.

        initializedMousePosition();

        displayMouse(); // Mouse를 다시 그린다.
        
        GameState.score += 10; // 점수 증가
        console.log(`[snakeEatMouseCheck] Score increased to: ${GameState.score}`);
    }
}

function moveSnake() {
    const head = SnakeState.head[0]; 
    let nextHead;
    let nextBody;

    prohibitSnakeNextMove(SnakeState.prevDirection, SnakeState.direction); // Snake의 다음 Move를 제한한다.

    // Snake의 방향에 따라 새로운 Head 위치를 계산한다.
    switch (SnakeState.direction) {
        case 'UP':
            nextHead = { x: head.x, y: head.y - 1 };
            break;
        case 'DOWN':
            nextHead = { x: head.x, y: head.y + 1 };
            break;
        case 'LEFT':
            nextHead = { x: head.x - 1, y: head.y };
            break;
        case 'RIGHT':
            nextHead = { x: head.x + 1, y: head.y };
            break;
        default:
            console.error('[moveSnake] Invalid snake direction');
            return; 
    }
    
    if (!checkSnakeHeadAndBodyCollision(nextHead, SnakeState.direction)) {
        console.error('[moveSnake] Snake cannot move in the current direction due to collision with its body');
        //snake가 몸쪽으로 이동하는 경우, 이전 방향으로 이동한다.
        // 이전 값을 저장해두는 것이 필요하네요.
        setNextHeadPositionInPrevStateDirection(SnakeState.prevDirection);
    }
    let snakeHeadPrevPos = SnakeState.head[0]; // 이전 Head 위치를 저장한다.
    SnakeState.head.unshift(nextHead); // 새로운 Head를 추가한다.

    // body[0]은 head를 따라가고, body[1]은 body[0]을 따라간다.
    // 따라서, body[0]의 위치를 다음 Head 위치로 업데이트한다.
    let snakeBodyNextPos = SnakeState.body[0];
    for (let i = 0; i < SnakeState.body.length; i++) {
        if (i === 0) {
            nextBody = snakeHeadPrevPos; // body[0]은 head를 따라간다.
        } else {
            nextBody = snakeBodyNextPos; // body[i]는 body[i-1]을 따라간다.
        }
        snakeBodyNextPos = SnakeState.body[i]; // 다음 body[i]를 위해 변경 되기 전, body를 저장한다.
        SnakeState.body[i] = nextBody;
    }
    
    setSnakePrevDirection(SnakeState.direction); // Snake의 이전 방향을 설정한다.
    
    displayMoveSnake(); // Snake를 다시 그린다.
    
    SnakeDieCheck(); // Snake가 죽었는지 확인한다.

    // Snake가 먹이를 먹었는지 확인한다.
    snakeAteMouseCheck();
}

function growSnake() {
    const tail = SnakeState.body[SnakeState.body.length - 1];
    // Snake의 길이를 늘린다.
    SnakeState.body.push({ ...tail}); //바디의 마지막 부분을 복사합니다.
    SnakeState.length += 1;
    
    console.log(`[growSnake] Snake grew to length: ${SnakeState.length}`);

    //약간 시간 정지하는 효과를 주기 위해서
    setTimeout(() => {
        console.log('[growSnake] Snake growth animation completed');
        //화면 깜빡임        
    }, 100); // 100ms 후에 Snake의 성장 애니메이션을 완료한다

}

function displaySnake() {
    const gameCanvas = document.getElementById('game-canvas');

    // Snake의 Head, Body를 가져온다.
    const snakeHeadPosition = SnakeState.head; // Initial position of the snake head
    const snakeBodyPositions = SnakeState.body; // Initial position of the snake body
    
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

    // 먹이 셀을 찾는다.
    const mouseCell = cells[MouseState.position.y * gridSize + MouseState.position.x];
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

    console.log(`[displayMouse] Mouse displayed at position: (${MouseState.position.x}, ${MouseState.position.y})`);
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
        case 'ArrowUp': // 'w' 키도 UP으로 처리
        case 'w': // 'w' 키도 UP으로 처리
            SnakeState.direction = 'UP';
            break;
        case 'ArrowDown': // 's' 키도 DOWN으로 처리
        case 's': // 's' 키도 DOWN으로 처리
            SnakeState.direction = 'DOWN';
            break;
        case 'ArrowLeft': // 'a' 키도 LEFT으로 처리
        case 'a': // 'a' 키도 LEFT으로 처리
            SnakeState.direction = 'LEFT';
            break;
        case 'ArrowRight': // 'd' 키도 RIGHT으로 처리
        case 'd': // 'd' 키도 RIGHT으로 처리
            SnakeState.direction = 'RIGHT';
            break;
        default:
            console.log(`[keydown] Invalid key: ${event.key}`);
    }
});