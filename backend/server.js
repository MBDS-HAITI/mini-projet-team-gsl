import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import * as student from './routes/students.js';
import * as course from './routes/courses.js';
import * as grade from './routes/grades.js';
import * as user from './routes/users.js';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import { initDb } from './db.js';


dotenv.config();

let app = express();

app.use(clerkMiddleware());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

const prefix = '/api';

app.route(prefix + '/students')
    .get(student.getAll)
    .post(student.create);

app.route(prefix + '/courses')
    .get(course.getAll)
    .post(course.create);

app.route(prefix + '/grades')
    .get(grade.getAll)
    .post(grade.create);

app.route(prefix + '/users')
    .get(user.getAll);

app.route(prefix + '/users/:id')
    .put(requireAuth, user.update);


initDb();

app.listen(port, "0.0.0.0");

console.log('Serveur démarré sur http://localhost:' + port);

export default app;