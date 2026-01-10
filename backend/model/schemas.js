import mongoose from 'mongoose';

let Schema = mongoose.Schema;

// Student Schema
let StudentSchema = Schema({
    firstName: String,
    lastName: String,
});

let Student = mongoose.model('Student', StudentSchema);

// Course Schema
let courseSchema = Schema({
    name: String,
    code: String,
});

let Course = mongoose.model('Course', courseSchema);

// Grade Schema
let gradeSchema = Schema({
    student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    grade: Number,
    date: Date,
});

let Grade = mongoose.model('Grade', gradeSchema);

// Exports the modeles
export {
    Student,
    Course,
    Grade,
}