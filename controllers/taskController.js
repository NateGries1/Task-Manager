//const Task = require('../prisma/schema.prisma');
import router from "../app.js";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/task', async (req, res) => {
   
    try {
        const { name, description, taskType, userid, createdDate, dueDate, completedDate } = req.body;

        if (
            !req.body.name ||
            !req.body.description ||
            !req.body.taskType ||
            !req.body.userid ||
            !req.body.createdDate ||
            !req.body.dueDate ||
            !req.body.completedDate
        ) {
            return res.status(400).json({
                message: "Missing required fields",
              });
        }
        
        const task = await prisma.task.create({
            data: {
                name,
                description,
                taskType,
                userid,
                createdDate,
                dueDate,
                completedDate,
            },
        });

        return res.status(201).json({ message: "Task Created", task });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
