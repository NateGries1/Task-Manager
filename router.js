//const Task = require('../prisma/schema.prisma');
import router from "./app.js";
const { PrismaClient } = require('@prisma/client')
const { passwordStrength } = require('check-password-strength')
const prisma = new PrismaClient()

//Users
/*
    id        Int      @id @default(autoincrement())
    firstName String
    lastName  String
    phone     String?
    email     String   @unique
    password  String
    tasks     Task[]
*/

router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
        const user = await db.user.findUnique({
            where: { id: parseInt(userId) },
        });
  
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
  
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

router.post('/user', async (req, res) => {

       
    try {
        const { firstName,
                lastName,
                phone=null,
                email,
                password
        } = req.body;

        if (passwordStrength(password).value !== 'Strong') {
            return res.status(400).json({
                message: "Password must be strong",
            });
        }
        
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                message: "Missing required fields",
              });
        }
        
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                phone,
                email,
                password
            },
        });
        
        return res.status(201).json({ message: "User Created", user });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});




//Task
/*
    id           Int      @id @default(autoincrement())
    name         String
    description  String
    taskType     String
    userid       Int
    createdDate  DateTime
    dueDate      DateTime
    completedDate DateTime?
    user         User     @relation(fields: [userid], references: [id])
*/

router.post('/task', async (req, res) => {
   
    try {
        const { name,
                description,
                taskType,
                userid,
                createdDate,
                dueDate,
                completedDate=null
        } = req.body;

        if (
            !req.body.name ||
            !req.body.description ||
            !req.body.taskType ||
            !req.body.userid ||
            !req.body.createdDate ||
            !req.body.dueDate
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
                completedDate
            },
        });

        return res.status(201).json({ message: "Task Created", task });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
