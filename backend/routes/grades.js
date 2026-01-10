import { Grade, Student, Course } from '../model/schemas.js';

function getAll(req, res) {
    Grade.find()
        .populate('student')
        .populate('course')
        .then((grades) => {
            res.send(grades);
        }).catch((err) => {
        res.send(err);
    });
}


function create(req, res) {
    let grade = new Grade();

    if (!req.body || !req.body.student || !req.body.course || req.body.grade == null || !req.body.date) {
        res.status(400).json({
            message: "Student, course, grade and date are required"
        });
        return;
    }

    grade.student = req.body.student;
    grade.course = req.body.course;
    grade.grade = req.body.grade;
    grade.date = req.body.date;

    grade.save()
        .then((grade) => {
                res.json({message: `grade saved with id ${grade.id}!`});
            }
        ).catch((err) => {
        console.log(err);
        res.status(400).send('cant post grade ', err.message);
    });
}

export { getAll, create };