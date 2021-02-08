const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const file = require('./users.json');

const app = express();
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { users: [] });
})

app.get('/create', (req, res) => {
    res.render('create');
})

app.get('/list', (req, res) => {
    fs.readFile('./users.json', (err, data) => {
        if (err) throw err;
        const object = JSON.parse(data);
        res.render('list', {users: object.users});
    })
})

app.post('/list', (req, res) => {
    let newUser = {
        id: uuid.v4(),
        username: req.body.name,
        email: req.body.email,
        age: req.body.age
    };

    file.users.push(newUser);
    const info = JSON.stringify(file);
    
    fs.writeFile('./users.json', info, (err) => {
        if (err) throw err;
    })

    fs.readFile('./users.json', (err, data) => {
        if (err) throw err;
        const object = JSON.parse(data);
        res.render('list', {users: object.users})
    })
})

app.get('/edit', (req, res) => {
    fs.readFile('./users.json', (err, data) => {
        if (err) throw err;
        const object = JSON.parse(data);
        res.render('edit', {users: object.users});
    })
})

app.post('/update', (req, res) => {
    fs.readFile('./users.json', (err, data) => {
        if (err) throw err;
        const object = JSON.parse(data);
        for (let i = 0; i < Object.keys(object).length; i++) {
            if(req.body.id == object.users[i].id && (req.body.username != object.users[i].username) || (req.body.email != object.users[i].email) || (req.body.age != object.users[i].age)) {
                let newUser = {
                    id: object.users[i].id,
                    username: req.body.username,
                    email: req.body.email,
                    age: req.body.age
                };
                
                file.users.splice(i, 1, newUser);
                const info = JSON.stringify(file);

                fs.writeFile('./users.json', info, (err) => {
                    if (err) throw err;
                })

                fs.readFile('./users.json', (err, data) => {
                    if (err) throw err;
                    const object = JSON.parse(data);
            
                    res.render('list', { users: object.users })
                })
            }
        }
    })
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})