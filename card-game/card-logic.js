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
    // 이모티콘을 화면에 추가
    emojisTwiceCopy.forEach(emoji => {
        const emojiElement = document.createElement('div');
        emojiElement.textContent = emoji; //이모티콘 추가
        emojiElement.className = 'emoji-item'; // 스타일 추가 위해서
        container.appendChild(emojiElement);
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

