const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method')); // Method-Override 설정

// 템플릿 엔진 설정
app.set('view engine', 'ejs');
app.set('views', './views');

// 서버 시작
app.get('/', (req, res) => {
    res.send('블로그 서버에 오신 것을 환영합니다!');
});

let posts = []; // 게시글을 저장하는 배열

// 게시글 목록 보기
app.get('/posts', (req, res) => {
    res.render('posts', { posts });
});

// 새 게시글 작성 페이지
app.get('/posts/new', (req, res) => {
    res.render('new');
});

// 게시글 작성 (POST 요청)
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    const newPost = {
        id: posts.length + 1,
        title,
        content,
        createdAt: new Date() // 작성 시각 추가
    };
    posts.push(newPost);
    res.redirect('/posts');
});

// 게시글 수정 페이지
app.get('/posts/:id/edit', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    res.render('edit', { post }); // 'edit.ejs' 템플릿에 게시글 데이터 전달
});

// 게시글 수정 (PUT 요청)
app.put('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    // 기존 작성일은 유지하고 제목과 내용을 업데이트
    posts[postIndex] = { id: postId, title, content, createdAt: posts[postIndex].createdAt };
    res.redirect('/posts');
});

// 게시글 삭제
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    posts = posts.filter(p => p.id !== postId);
    res.redirect('/posts'); // 삭제 후 게시글 목록 페이지로 리다이렉트
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
