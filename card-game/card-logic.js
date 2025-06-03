const GameState = {
    level: 'EASY', // EASY, MEDIUM, HARD
    life: 3,
    hint: 3,
    cardEmoji: 8, // 이모티콘 개수 (레벨에 따라 다름)
    cardWaitTime: 500, // 카드 뒤집기 대기 시간 (밀리초)
    cardWaitTimeAfterFlip: 3000, // 카드 뒤집기 후 대기 시간 (밀리초)
    cardMatchedFailTime: 1000, // 카드 매칭 실패 시 대기 시간 (밀리초)
    lifeCounts: { // LEVEL, LIFE COUNT
        EMPTY: 0,
        EASY: 3,
        MEDIUM: 4,
        HARD: 5
    }, 
    hintCounts: {
        EMPTY: 0,
        EASY: 3,
        MEDIUM: 5,
        HARD: 7
    },
    cardEmojiCounts: {
        EASY: 8, // Easy 레벨 이모티콘 개수
        MEDIUM: 16, // Medium 레벨 이모티콘 개수
        HARD: 32 // Hard 레벨 이모티콘 개수
    }
};

async function fetchEmojis(count) {
    try {
        const response = await fetch('/api/emojis');
        if (!response.ok) {
            throw new Error('Function: fetchEmojis, Failed fetchEmojis to fetch emojis');
        }
        const emojis = await response.json();
        // emojis의 총 개수에서, count만큼 랜덤하게 가져오기
        emojis.sort(() => Math.random() - 0.5); // 랜덤하게 섞기
        return emojis.slice(0, count);
    } catch (error) {
        console.error('Function:fetchEmojis, Error fetchEmojis emojis:', error);
        return [];
    }
}

function displayEmojis(emojis) {
    const container = document.getElementById('card-make-position');
    container.innerHTML = ''; // Clear Previous Content

    emojisTwiceCopy = [...emojis, ...emojis]; // 이모티콘을 두 번 복사하여 배열 생성
    emojisTwiceCopy.sort(() => Math.random() - 0.5); // 랜덤하게 섞기

    const cards = []; // 카드들을 저장할 배열
    let firstCard = null;
    let secondCard = null;

    // 이모티콘을 화면에 추가
    emojisTwiceCopy.forEach(emoji => {
        // Card Class 추가
        const card = document.createElement('div');
        card.className = 'card';


        // Card Inner Class 추가
        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        // Card Front Class 추가
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = emoji;

        // Card Back Class 추가
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.textContent = '❓'; // 뒷면에 물음표 표시

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        // Add to Click Event
        card.addEventListener('click', () => {
            if (firstCard && cardInner === firstCard.cardInner) {
                console.log("[DEBUG] 첫 번째 카드가 이미 선택되었습니다. 다시 선택할 수 없습니다.");
                return; // 아무 동작도 하지 않음
            }
            if (cardInner.classList.contains('matched')) {
                console.log("[DEBUG] 이미 매칭된 카드입니다. 다시 선택할 수 없습니다.");
                return; // 아무 동작도 하지 않음
            }

            cardInner.classList.toggle('flipped');
            
            // 카드 선택 로직
            if (!firstCard) {
                firstCard = { cardInner, emoji }; // 처음 카드 선택 정보 저장
                cardInner.classList.add('Select-1'); // 처음 선택, 클래스 추가
                // Select-1을 다시 클릭할 수 없도록 click 이벤트를 방지해야함

            } else if (!secondCard && cardInner !== firstCard.cardInner) {
                secondCard = { cardInner, emoji }; // 두 번째 카드 선택 정보 저장
                cardInner.classList.add('Select-2'); // 두 번째 선택, 클래스 추가
            }

            // 두 카드의 이모지가 동일한지 비교
            // 동일하면, 두 카드를 유지하고, 동일하지 않으면 다시 뒤집기
            // 유지할 때는, classList에 'matched'를 추가해서 다시 클릭되지 않게 만든다.
            if (firstCard && secondCard) {
                if (firstCard.emoji === secondCard.emoji) {
                    // 두 카드가 동일한 경우
                    firstCard.cardInner.classList.add('matched');
                    secondCard.cardInner.classList.add('matched');
                    console.log("[DEBUG] 첫 번째 카드:", firstCard.emoji, "두 번째 카드:", secondCard.emoji);
                    firstCard = null; // 선택 초기화
                    secondCard = null; // 선택 초기화                    
                    console.log("[DEBUG] 두 카드가 동일합니다. 매칭 성공!");
                } else {
                    // 두 카드가 동일하지 않은 경우
                    setTimeout(() => {
                        console.log("[DEBUG] 두 카드 정보: ", firstCard.cardInner, secondCard.cardInner);
                        firstCard.cardInner.classList.remove('flipped', 'Select-1'); // 첫 번째 카드 뒤집기 해제
                        secondCard.cardInner.classList.remove('flipped', 'Select-2'); // 두 번째 카드 뒤집기 해제
                        console.log("[DEBUG] 두 카드가 동일하지 않습니다. 매칭 실패!");
                        console.log("[DEBUG] 첫 번째 카드:", firstCard.emoji, "두 번째 카드:", secondCard.emoji);                        
                        firstCard = null; // 선택 초기화
                        secondCard = null; // 선택 초기화                                                
                        decreaseLife(); // 생명 감소
                    }, GameState.cardMatchedFailTime); // 카드 매칭 실패 시 대기 시간
                }
            }

        });

        container.appendChild(card); // 카드 컨테이너에 카드 추가
        cards.push(card); // 카드 배열에 추가
    });

    // 카드들을 순차적으로 뒤집을 때, 카드 컨테이너 비활성화
    container.classList.add('disabled');

    flipCardsSequentially(cards, () => {
        setTimeout(() => {
            flipCardsSequentially(cards, () => {
                container.classList.remove('disabled'); // 카드 컨테이너 활성화
            });
        }, GameState.cardWaitTimeAfterFlip);
    });
}

function flipCardsSequentially(cards, callback) {
    cards.forEach((card, index) => {
        setTimeout(() => {
            const cardInner = card.querySelector('.card-inner'); // 현재 카드의 .card-inner 요소 가져오기
            cardInner.classList.toggle('flipped'); // 카드 뒤집기

            if (index === cards.length - 1 && callback) {
                // 마지막 카드 뒤집기 후 콜백 실행
                callback();
            }
        }, index * GameState.cardWaitTime); // 0.5초 간격으로 실행
    });
}

/*
    카드 하나 뒤집기 테스트
*/
function oneCardFlippedTest(cards) {
    // 카드 하나 뒤집기 테스트
    setTimeout(() => {
        if (cards.length > 0) {
            //cards[0]의 cardInner 요소를 가져오기
            const cardInner = cards[0].querySelector('.card-inner');
            cardInner.classList.toggle('flipped'); // 첫 번째 카드 뒤집기
        }        
    }, 500);
}

function increaseLife() {
    const maxLife = GameState.lifeCounts[GameState.level];
    if (GameState.life < maxLife) {
        GameState.life++;
        appendLifeContainer(document.getElementById('life-container'));
        console.log("[DEBUG] Life increased to:", GameState.life);
    } else {
        console.log("[DEBUG] Life cannot be increased further at this level.");
    }
}

function decreaseLife() {
    if (GameState.life > 0) {
        GameState.life--;
        console.log("[DEBUG] Life decreased to:", GameState.life);
        if (GameState.life <= 0) {
            console.log("[DEBUG] Game Over! No more lives left.");
            // 게임 오버 처리 로직 추가
            alert("Game Over! No more lives left.");
            // 게임 초기화 또는 다시 시작 로직 추가
            initializeGame();
        } else {
            popLifeContainer(document.getElementById('life-container'));
        }
    }
}

function popLifeContainer(lifeContainer) {
    if (lifeContainer.children.length === 0) {
        console.log("[DEBUG] No life icons to remove");
        return; // 더 이상 제거할 생명 아이콘이 없음
    }
    lifeContainer.removeChild(lifeContainer.lastChild);
    console.log("[DEBUG] Life icon removed");
}

function appendLifeContainer(lifeContainer) {
    const lifeIcon = document.createElement('span');
    lifeIcon.className = 'life-icon';
    lifeIcon.textContent = '❤️'; // 생명 아이콘
    lifeContainer.appendChild(lifeIcon);
    console.log("[DEBUG] Life icon appended");
}

function makeLifeContainer() {
    const lifeContainer = document.getElementById('life-container');
    lifeContainer.innerHTML = ''; // Clear Previous Content
    for (let i = 0; i < GameState.life; i++) {
        appendLifeContainer(lifeContainer);
    }
    console.log("[DEBUG] Life container created with", GameState.life, "lives.");
}

function popHintContainer(hintContainer) {
    if (hintContainer.children.length === 0) {
        console.log("[DEBUG] No hint icons to remove");
        return; // 더 이상 제거할 힌트 아이콘이 없음
    }
    hintContainer.removeChild(hintContainer.lastChild);
    console.log("[DEBUG] Hint icon removed");
}

function appendHintContainer(hintContainer) {
    const HintIcon = document.createElement('span');
    HintIcon.className = 'hint-icon';
    HintIcon.textContent = '💡'; // 힌트 아이콘
    hintContainer.appendChild(HintIcon);
    console.log("[DEBUG] Hint icon appended");
}

function makeHintContainer() {
    const makeHintContainer = document.getElementById('hint-container');
    makeHintContainer.innerHTML = ''; // Clear Previous Content
    for (let i = 0; i < GameState.hint; i++) {
        appendHintContainer(makeHintContainer);
    }
    console.log("[DEBUG] Hint container created with", GameState.hint, "hints.");
}

function easy() {
    console.log("Easy level selected");
    setLevel('EASY'); // Easy 레벨로 초기화
    makeLifeContainer(); // 생명 아이콘 생성
    makeHintContainer(); // 힌트 아이콘 생성
    fetchEmojis(GameState.cardEmoji).then(displayEmojis);
    
}

function medium() {
    console.log("Medium level selected");
    setLevel('MEDIUM'); // Medium 레벨로 초기화
    makeLifeContainer(); // 생명 아이콘 생성
    makeHintContainer(); // 힌트 아이콘 생성
    fetchEmojis(GameState.cardEmoji).then(displayEmojis);
}

function hard() {
    console.log("Hard level selected");
    setLevel('HARD'); // Hard 레벨로 초기화
    makeLifeContainer(); // 생명 아이콘 생성
    makeHintContainer(); // 힌트 아이콘 생성
    fetchEmojis(GameState.cardEmoji).then(displayEmojis);
}

function initializeGame() {
    setLevel('EASY'); // Easy 레벨로 초기화
    const container = document.getElementById('card-make-position');
    container.innerHTML = ''; // Clear Previous Content
    makeLifeContainer(); // 생명 아이콘 생성
    makeHintContainer(); // 힌트 아이콘 생성
    console.log("[DEBUG] Game initialized. Life reset to 0 and level set to Easy.");
}

function setLevel(level) {
    GameState.level = level;
    GameState.life = GameState.lifeCounts[level];
    GameState.hint = GameState.hintCounts[level];
    GameState.cardEmoji = GameState.cardEmojiCounts[level];
    console.log("[DEBUG] LEVEL: ", GameState.level);
    console.log("[DEBUG] LIFE: ", GameState.life);
    console.log("[DEBUG] HINT: ", GameState.hint);
    console.log("[DEBUG] CARD EMOJI: ", GameState.cardEmoji);
}