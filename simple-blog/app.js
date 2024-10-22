/**** Express 서버 코드 ****/
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method')); // Method-Override 설정
app.use(express.static('public')); // 정적 파일 서빙

// 템플릿 엔진 설정
app.set('view engine', 'ejs');
app.set('views', './views');

// 게시글 데이터를 저장하는 배열
let posts = [];

// 메인 페이지 렌더링
app.get('/', (req, res) => {
    res.render('index', { title: '블로그 서버에 오신 것을 환영합니다!' });
});

// 게시글 목록 보기
app.get('/posts', async (req, res) => {
    try {
        res.render('posts', { posts });
    } catch (error) {
        res.status(500).send('게시글을 가져오는 중 오류가 발생했습니다.');
    }
});

// 새 게시글 작성 페이지
app.get('/posts/new', (req, res) => {
    res.render('new');
});

// 게시글 작성
app.post('/posts', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = {
            id: posts.length + 1,
            title,
            content,
            createdAt: new Date() // 작성 시각 추가
        };
        posts.push(newPost);
        res.redirect('/posts');
    } catch (error) {
        res.status(500).send('게시글을 작성하는 중 오류가 발생했습니다.');
    }
});

// 게시글 수정 페이지
app.get('/posts/:id/edit', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const post = posts.find(p => p.id === postId);

        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        res.render('edit', { post });
    } catch (error) {
        res.status(500).send('게시글 수정 페이지를 불러오는 중 오류가 발생했습니다.');
    }
});

// 게시글 수정
app.put('/posts/:id', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const { title, content } = req.body;
        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex === -1) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        posts[postIndex] = { id: postId, title, content, createdAt: posts[postIndex].createdAt };
        res.redirect('/posts');
    } catch (error) {
        res.status(500).send('게시글을 수정하는 중 오류가 발생했습니다.');
    }
});

// 게시글 삭제
app.delete('/posts/:id', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        posts = posts.filter(p => p.id !== postId);
        res.redirect('/posts');
    } catch (error) {
        res.status(500).send('게시글을 삭제하는 중 오류가 발생했습니다.');
    }
});

// 404 처리
app.use((req, res) => {
    res.status(404).send('페이지를 찾을 수 없습니다.');
});

// 전역 에러 핸들링
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || '서버 내부 오류가 발생했습니다.');
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
