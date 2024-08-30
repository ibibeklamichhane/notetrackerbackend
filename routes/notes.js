const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");


//Route 1:Get all the  Notes using:GET "/api/notes/fetchallnotes".Login required
router.get('/fetchallnotes', fetchuser,async(req,res)=>{


try {
    const notes = await Note.find({user:req.user.id});
    res.json (notes)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error");
    
}
})


//Route 1:Get all the  Notes using:POST "/api/notes/addnote".Login required
router.post('/addnote', fetchuser,[

    body("title",'Enter a valid title').isLength({ min: 3 }),
    body("description",'Description must be atleast 10 characters').isLength({ min: 5 }),

],async(req,res)=> { 

    try {
        const {title,description,tag}= req.body;
        //If there are errors return the messages
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title,description,tag,user:req.user.id
        })
        const saveNote =await note.save();
        res.json(saveNote)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
        
    }
    })

//Route 1:Update all the  Notes using:PUT "/api/notes/updatenote".Login required

router.put('/updatenote/:id', fetchuser,async (req,res) =>{
    const {title,description,tag} =req.body;
    //create new note object

    const newNote = {};

    if(title){newNote.title = title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};

    //FInd the note to be updated and update  it 

    let note = await Note.findById(req.params.id);
    if (!note){return res.status(404).send("Not Found")}

    if (note.user.toString() !== req.user.id) {

        return res.status( 404).send("Not Allowed")
}
    note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note});
}


);

//Route 41:Delete  all the  Notes using:DELETE "/api/notes/deletenote".Login required

router.delete('/deletenote/:id', fetchuser,async (req,res) =>{
    try {

    let note = await Note.findById(req.params.id);
    if (!note){return res.status(404).send("Not Found")}

    if (note.user.toString() !== req.user.id) {

        return res.status( 401).send("Not Allowed")
}
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"success":"Note has been deleted"});
}
        
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
        
    }

    

   
}
    
);


module.exports = router;
