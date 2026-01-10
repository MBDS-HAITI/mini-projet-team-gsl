import { Course } from '../model/schemas.js';

function getAll(req, res) {
    Course.find().then((classes) => {
        res.send(classes);
    }).catch((err) => {
        res.send(err);
    });
}


function create(req, res) {
    let course = new Course();

    if (!req.body || !req.body.name || !req.body.code) {
        res.status(400).json({
            message: "Name and code are required"
        });
        return;
    }

    course.name = req.body.name;
    course.code = req.body.code;

    course.save()
        .then((course) => {
                res.json({message: `course saved with id ${course.id}!`});
            }
        ).catch((err) => {
        res.send('cant post course ', err);
    });
}

export { getAll, create };