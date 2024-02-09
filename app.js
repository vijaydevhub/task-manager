const express = require('express');
const fs = require('fs');
const taskData = require('./task.json');
const Validator = require('./helper/validator.js');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});


app.delete('/tasks/:id', (req, res) => {
    const taskList = taskData.tasks;
    let taskDetailsModified = taskData;
    let filteredTask = taskList.filter(task => task.id !== req.params.id);
    if (filteredTask.length == 0){
        return res.status(404).send('Given task ID '+req.params.id+ 
            ' is not found. Please retry with different task ID');
    }
    //taskDetailsModified.tasks.push(userProvidedDetails);
    fs.writeFile('./task.json', JSON.stringify(filteredTask), {encoding: 'utf8', flag: 'w'}, (err, data) => {
        if(err){
            return res.status(500).send("Something went wrong");
        } else {
            return res.status(200).send("Task has been updated successfully");
        }
    });
    return res.status(200).send(filteredTask);
})

app.put('/tasks/:id', (req, res) => {
    const id = req.params.id;
    
    const task = taskData.tasks.find(task => task.id === parseInt(id));
    if(Validator.validateTaskInfo(task).status == true){
        let taskDetailsModified = taskData;
        task.title = req.body.title;
        task.description = req.body.description;
        task.completed = req.body.completed;
        taskDetailsModified.tasks.splice(id-1, 1, task);
        fs.writeFile('./task.json', JSON.stringify(taskDetailsModified), {encoding: 'utf8', flag: 'w'}, (err, data) => {
            if(err){
                return res.status(500).send("Something went wrong");
            } else {
                return res.status(200).send("Task has been updated successfully");
            }
        });
    } else {
        return res.status(400).json(Validator.validateTaskInfo(task));
    }
})

app.post('/tasks', (req, res) => {
    const taskList = taskData.tasks;
    const task = req.body;
    const userProvidedDetails = req.body;

    if(!userProvidedDetails.hasOwnProperty("completed")){
        userProvidedDetails.completed = "false";
    }

    userProvidedDetails.id = taskData.tasks.length + 1; 
    if(Validator.validateTaskInfo(userProvidedDetails).status == true){
        let taskDetailsModified = taskData;
        taskDetailsModified.tasks.push(userProvidedDetails);
        fs.writeFile('./task.json', JSON.stringify(taskDetailsModified), {encoding: 'utf8', flag: 'w'}, (err, data) => {
            if(err){
                return res.status(500).send("Something went wrong");
            } else {
                return res.status(201).send("Task has been created successfully");
            }
        });
    } else {
        return res.status(400).json(Validator.validateTaskInfo(userProvidedDetails));
    }
})

app.get('/tasks/:id', (req, res) => {
    const taskList = taskData.tasks;
    let filteredTask = taskList.filter(task => task.id == req.params.id);
    if (filteredTask.length == 0){
        return res.status(404).send('Given task ID '+req.params.id+ 
            ' is not found. Please retry with different task ID');
    }
    return res.status(200).send(filteredTask);
})

app.get('/', (req, res) => {
    return res.status(200).send("Welcome to Task Manager");
})

app.get('/tasks', (req, res) => {
    return res.status(200).json(taskData);
})


module.exports = app;