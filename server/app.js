import express from 'express';

import * as usersDb from './utils/user';

import * as store from './products/store';
import * as basket from './products/basket';

usersDb.setUpConnection();

const app = express();

app.use(express.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

app.get('/api/users/:id', (req, res) => {
    usersDb.findUserById(req.params.id)
        .then(data => {
            res.send(JSON.stringify({ userName: data.login }));
            throw new Error('Not found');
        })
        .catch(e => {
            res.status('404').end()
        });
});

app.post('/api/users/auth', (req, res) => {
    usersDb.findUser(req.body.login)
        .then(data => {
            if (req.body.password === data[0].password) {
                res.send(JSON.stringify({ userId: data[0]._id }));
            }
            throw new Error('Wrong password');
        })
        .catch(e => {
            if (e.message === 'Wrong password') res.status('401').end()
            res.status('404').end()
        });
});

app.post('/api/users/reg', (req, res) => {
    usersDb.findUser(req.body.login)
        .then(data => {
            if (data.length !== 0) res.status('401').end();
            else {
                usersDb.createUser(req.body.login, req.body.password)
                    .then(data => {
                        res.status('201').send(JSON.stringify({ userId: data._id }));
                    })
            }
        });
});

app.get('/api/products', (req, res) => {
    res.send(JSON.stringify(store.getAllProducts()));
});

app.get('/api/products/:itemId', (req, res) => {
    res.send(JSON.stringify(store.getProduct(req.params.itemId)));
});

app.get('/api/basket', (req, res) => {
    let userId = req.headers['set-cookie'][0].split(';')[0].split('=')[1];
    let basketIds = basket.getAllProducts(userId);
    if (basketIds) {
        let basketProducts = basketIds.map(function (id, i) {
            return store.getProduct(id);
        });
        res.send(JSON.stringify(basketProducts));
    }
    else res.send(JSON.stringify([]));
});

// v вроде не нужный метод?? v

app.get('/api/basket/:itemId', (req, res) => {
    let userId = req.headers['set-cookie'][0].split(';')[0].split('=')[1];
    let basketIds = basket.addProduct(userId, req.params.itemId);
    if (basketIds) {
        let basketProducts = basketIds.map(function (id, i) {
            return store.getProduct(id);
        });
        res.send(JSON.stringify(basketProducts));
    }
    else res.send(JSON.stringify([]));
});

app.delete('/api/basket', (req, res) => {
    let userId = req.headers['set-cookie'][0].split(';')[0].split('=')[1];
    basket.deleteAllProducts(userId);
    res.send(JSON.stringify([]));
});

app.delete('/api/basket/:itemId', (req, res) => {
    let userId = req.headers['set-cookie'][0].split(';')[0].split('=')[1];
    let basketIds = basket.deleteProduct(userId, req.params.itemId);
    let basketProducts = basketIds.map(function (id, i) {
        return store.getProduct(id);
    });
    res.send(JSON.stringify(basketProducts));
})

const server = app.listen(process.env.PORT, () => console.log(`Server is up and running on port ${process.env.PORT}`));