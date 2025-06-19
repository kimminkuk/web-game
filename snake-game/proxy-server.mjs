import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 파일의 디렉토리 경로 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// express 앱 생성
const app = express();

//정적 파일 제공 설정
app.use(express.static(__dirname));

// 라우트 설정
app.get('/', (req, res) => {
    res.sendFile(Path2D.join(__dirname, 'index.html'));
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});

// 에러 핸들러
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
// 404 핸들러
app.use((req, res) => {
    res.status(404).send('Page not found');
});
// CORS 설정
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});