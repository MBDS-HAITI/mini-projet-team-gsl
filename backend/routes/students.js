import { Student } from '../model/schemas.js';

function getAll(req, res) {
    Student.find().then((students) => {
        res.send(students);
    }).catch((err) => {
        res.send(err);
    });
}


function create(req, res) {
    let student = new Student();

    if (!req.body || !req.body.firstName || !req.body.lastName) {
        res.status(400).json({
            message: "First name and last name are required"
        });
        return;
    }

    student.firstName = req.body.firstName;
    student.lastName = req.body.lastName;

    student.save()
        .then((student) => {
            res.json({ message: `student saved with id ${student.id}!` });
        }
        ).catch((err) => {
            res.send('cant post student ', err);
        });
}

export { getAll, create };