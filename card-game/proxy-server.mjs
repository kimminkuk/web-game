import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// 정적 파일 제공 설정
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  // res.send('Proxy server is running. Use /api/emojis to fetch emojis.');
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/emojis', async (req, res) => {
  try {
    console.log('API Key:', process.env.EMOJI_API_KEY); // API
    const response = await fetch(`https://emoji-api.com/emojis?access_key=${process.env.EMOJI_API_KEY}`);
    if (!response.ok) {
      return res.status(response.status).send('[1] Error fetching emojis');
    }
    
    const data = await response.json(); // JSON 데이터를 먼저 파싱
    const emojis = data.map(emoji => emoji.character); // 이모지 문자만 추출
    // 전체 emojis 전부 가져오기
    // const emojisAll = data.map(emoji => emoji); // 전체 이모지 객체 배열 가져오기
    res.json(emojis); // 클라이언트에 이모지 문자 배열을 JSON 형태로 응답
    //res.json(JSON.stringify(emojisAll)); // 전체 이모지 객체 배열을 JSON 형태로 응답
  } catch (error) {
    res.status(500).send('[2] Error fetching emojis');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});