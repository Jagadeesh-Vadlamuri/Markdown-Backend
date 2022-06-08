const taskModel = require('../models/data');

const getTasks = async(req, res) => {
    try{
        let tasks = await taskModel.find({}).sort({createdAt: "desc"});

        if(tasks) {
            res.json(tasks)
        }
    } catch(e){
        console.log(e)
    }
}

const getTask = async(req, res) => {
    try{
        let task = await taskModel.findById(req.params.id)

        if(task){
            res.json(task)
        }
    } catch(e){
        console.log(e)
    }
}

const createTask = async(req, res) => {
    try{
        let task = new taskModel({
            title: req.body.title,
            description: req.body.description,
            markdown: req.body.markdown,
            createdAt: new Date()
        })

        const createTask = await task.save()
        if(createTask) {
            res.send(createTask)
        } 
    } catch(e){
        console.log(e)
    }
}

const updateTask = async(req, res) => {
    try{
        let task = await taskModel.findByIdAndUpdate(req.params.id, req.body)

        if(task){
            res.send("Updated Successfully")
        }
    } catch(e){
        console.log(e)
    }
}

const deleteTask = async(req, res)=>{
    try{
        let task = await taskModel.findByIdAndDelete(req.params.id)

        if(task){
            res.send("Deleted Successfully")
        }
    } catch(e){
        console.log(e)
    }
    
}

module.exports = {getTasks, getTask, createTask, updateTask, deleteTask}