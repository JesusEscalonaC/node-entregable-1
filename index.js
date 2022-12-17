const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
app.use(express.json());

const jsonPath = path.resolve('./files/toDoList.json');

app.get('/tasks', async(req, res)=>{
    jsonFile = await fs.readFile(jsonPath, 'utf-8');
    res.send(jsonFile);
});

app.post('/tasks', async(req, res)=>{
    const task = req.body;
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const lastIndex = tasksArray.length - 1;
    const newId = tasksArray[lastIndex].id + 1;
    tasksArray.push({id: newId, title: task.title, description: task.description, status: false});
    
    await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
    res.end();
})
app.put('/tasks/:id', async(req, res)=>{
    const task = req.body;
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const url = req.url;
    const idUrl = Number(url.replace("/tasks/", " "));
    const indexTask = tasksArray.findIndex(param => param.id == idUrl);
    if(indexTask !== -1 && task.status === true || task.status === false){
        tasksArray[indexTask].status = task.status;
        await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
    }else{
        console.log("error")
    } 
    
    res.end();
})
 app.delete('/tasks/:id', async(req, res)=>{
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const url = req.url;
    const idUrl = Number(url.replace("/tasks/", " "));
    const indexTask = tasksArray.findIndex(param => param.id == idUrl);
    if(indexTask !== -1){
        const newTaskArray = tasksArray.filter(task => task.id !== idUrl)
        await fs.writeFile(jsonPath, JSON.stringify(newTaskArray));
    }else{
        console.log("error")
    } 
    
    res.end();
 })

const PORT = 8000;
app.listen(PORT, ()=>{
    console.log(`servidor escuchando desde el puerto ${PORT}`);
});