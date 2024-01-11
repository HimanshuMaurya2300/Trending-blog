require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const cloudinary = require('./utils/cloudinary');
const upload = require('./utils/multer')

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';


app.use(cors({
    // origin: '*',
    origin: process.env.FRONTEND,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));


mongoose.connect(process.env.MONGODB)
    .then(() => {
        console.log('Database is connected...')
    })
    .catch(err => console.log(err))


app.post('/register', async (req, res) => {

    const { username, password } = req.body;

    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });

        res.json(userDoc);

    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
});



app.post('/login', async (req, res) => {

    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc?.password);

    if (passOk) {
        // logged in
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {

            if (err) {
                throw err;
            }

            res.cookie('token', token).json({
                id: userDoc._id,
                username,
                token: token
            })
        });

    }
    else {
        res.status(400).json('wrong credentials');
    }
});



app.get('/profile', (req, res) => {

    const { token } = req.cookies;

    jwt?.verify(token, secret, {}, (err, info) => {
        if (err) {
            throw err
        }
        res.json(info);
    });
});



app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});




app.post('/post', upload.single('file'), async (req, res) => {

    const { token } = req.body;
    // console.log(token)

    jwt.verify(token, secret, {}, async (err, info) => {

        if (err) {
            throw err
        }

        const cover = await cloudinary.uploader.upload(req.file.path)
        console.log(cover)

        const { title, summary, content } = req.body;

        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: cover.secure_url,
            cloudinary_id: cover.public_id,
            author: info.id,
        });

        res.json(postDoc);
    })
});



app.put('/post', upload.single('file'), async (req, res) => {

    let newCover = null;

    if (req.file) {
        newCover = await cloudinary.uploader.upload(req.file.path)
    }

    // const { token } = req.cookies;

    const { token } = req.body;
    // console.log(token);

    jwt.verify(token, secret, {}, async (err, info) => {

        if (err) {
            throw err
        };

        const { id, title, summary, content } = req.body;

        const postDoc = await Post.findById(id);

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }

        if (newCover) {
            await cloudinary.uploader.destroy(postDoc.cloudinary_id)
        }

        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newCover ? newCover.secure_url : postDoc.cover,
            cloudinary_id: newCover ? newCover.public_id : postDoc.cloudinary_id,
        });

        res.json(postDoc);
    });

});



app.get('/post', async (req, res) => {

    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
});



app.get('/post/:id', async (req, res) => {

    const { id } = req.params;

    const postDoc = await Post.findById(id).populate('author', ['username']);

    res.json(postDoc);
})



app.delete('/delete/:id', async (req, res) => {

    const { id } = req.params;

    const postInfo = await Post.findByIdAndDelete(id)

    await cloudinary.uploader.destroy(postInfo.cloudinary_id)

    res.json(postInfo);
})



app.listen(4000, () => {
    console.log('Server is running on port 4000')
});