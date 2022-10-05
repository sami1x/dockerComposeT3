import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { Schema, model, connect } from 'mongoose';
import * as dotenv from "dotenv";

const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.text());
app.use(bodyParser.json());
dotenv.config();


connect(`${process.env['MONGO_URL']}`, (err) => {
    if (err) throw err;
    console.log("database connected...")
});

interface task {
    text: string;

}

const userSchema = new Schema<task>({
    text: { type: String }

});

const Task = model<task>('Task', userSchema);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public'));
})

app.get("/getTasks", function (req, res) {

    const getTasks = async () => {
        let myTasks: String[] = [];
        const result = await Task.find();
        result.forEach((e) => {
            myTasks.push(e.text);
        });
        res.json(JSON.stringify(myTasks.reverse()));

    };

    getTasks();
});

app.post("/", function (req, res) {
    res.sendStatus(200);
    let toAdd = req.body;
    var myObj = JSON.parse(toAdd);

    const task = new Task({
        text: myObj.text,
    });
    task.save(function (err) {
        if (err) {
            console.log("error");
        } else {
            console.log("task added...");
        }
    });
});

app.post("/toRemove", function (req, res) {
    res.sendStatus(200);

    const getTasks = async () => {
        var myObj = JSON.parse(req.body);
        const result = await Task.deleteOne({ text: myObj.text });
    };
    getTasks();
});

app.listen(3000, () => {
    console.log("server running...")
})