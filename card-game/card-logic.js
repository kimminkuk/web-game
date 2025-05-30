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
            cardInner.classList.toggle('flipped'); // 카드 뒤집기
        });

        container.appendChild(card); // 카드 컨테이너에 카드 추가
        cards.push(card); // 카드 배열에 추가
    });

    // 카드들을 순차적으로 뒤집기
    filpCardsSequentially(cards, true, () => {
        setTimeout(() => {
            filpCardsSequentially(cards, false);
        }, cards.length * 500);
    });
}

function filpCardsSequentially(cards, flipToFront, callback) {
    cards.forEach((cardInner, index) => {
        setTimeout(() => {
            if (flipToFront) {
                cardInner.classList.remove('flipped'); // 카드 앞면으로 뒤집기
            } else {
                cardInner.classList.add('flipped'); // 카드 뒷면으로 뒤집기
            }

            if (index === cards.length - 1 && callback) {
                callback(); // 마지막 카드 뒤집기 후 콜백 호출
            }
        }, index * 500);
    });
}

function easy() {
    console.log("Easy level selected");
    fetchEmojis(8).then(displayEmojis);
}

function medium() {
    console.log("Medium level selected");
    fetchEmojis(16).then(displayEmojis);
}

function hard() {
    console.log("Hard level selected");
    fetchEmojis(32).then(displayEmojis);
}

