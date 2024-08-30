const mongoose = require('mongoose');
const NotesSchema = mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('note', NotesSchema);

//1.git add .

//2.git commit -m ".."
//
//3.git status
//
//4.git branch checkout ..(branch name)
//
//5.git pull origin master
//
//6.