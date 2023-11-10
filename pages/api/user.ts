import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma/db';
import { passwordStrength } from 'check-password-strength';
import { get } from "http";
import * as React from "react";

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
// pages/api/user.js


export default async function handler(route: string, req: NextApiRequest, res: NextApiResponse) {
    switch (route) {
        case '/user':
            switch(req.method) {
                case 'POST':
                    Userpost(req, res);
                    break;
                case 'DELETE':
                    Userdelete(req, res);
                    break;
                case 'PUT':
                    Userput(req, res);
                    break;
                default:
                    res.status(405).json({ error: 'Method Not Allowed' });
            }
            break;
        case '/user/:userId':
            Userget(req, res);
            break;
        case '/task':
            switch(req.method) {
                case 'POST':
                    Taskpost(req, res);
                    break;
                case 'DELETE':
                    Taskdelete(req, res);
                    break;
                case 'PUT':
                    Taskput(req, res);
                    break;
                default:
                    res.status(405).json({ error: 'Method Not Allowed' });
            }
            break;
        case '/task/:taskId':
            Taskget(req, res);
            break;
        default:
            res.status(404).json({ error: 'Not Found' });
    }
}

async function Userget(req: NextApiRequest, res: NextApiResponse) {
    const userId = Array.isArray(req.query.userId)? req.query.userId[0] : req.query.userId || '';
  
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });
  
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
  
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
}


async function Userpost(req: NextApiRequest, res: NextApiResponse ) {
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

    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}


async function Userdelete(req: NextApiRequest, res: NextApiResponse) {
    const rawuserId = Array.isArray(req.query.userId)? req.query.userId[0] : req.query.userId || '';
    const userId = parseInt(rawuserId);
    try {
        const deletedResource = await prisma.user.delete({
            where: { id: userId },
        });
        res.json({ message: `Deleted resource with ID ${deletedResource.id}` });
    } catch(eror) {
        res.status(500).json({ error: "Failed to delete user" });
    }
}


async function Userput(req: NextApiRequest, res: NextApiResponse) {
    if (!req.body || !req.body.userId) {
        return res.status(400).json({ error: "No request body" });
    }
    const userId = parseInt(req.body.userId);
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: req.body,
        });
        res.json(updatedUser);
    } catch(error) {
        res.status(500).json({ error: "Failed to update user" });
    }
}

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

async function Taskpost(req: NextApiRequest, res: NextApiResponse) {
   
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

        await prisma.user.update({
            where: { id: task.userid },
            data: {
              tasks: {
                connect: { id: task.id }, // Connect the new task to the user
              },
            },
        });

        return res.status(201).json({ message: `Task Created for ${userid}`, task });

    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

async function Taskget(req: NextApiRequest, res: NextApiResponse) {
    if (!req.body || !req.body.taskId) {
        return res.status(400).json({ error: "Task not Found" });
    }

    const taskId = Array.isArray(req.query.taskId)? req.query.taskId[0] : req.query.taskId || '';
    try {

        const task = await prisma.task.findUnique({
            where: { id: parseInt(taskId) },
        });
  
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
  
        res.json(task);
    } catch(error) {
        return res.status(500).json({ error: "Failed to fetch task" });
    }
}

async function Taskput(req: NextApiRequest, res: NextApiResponse) {
    if (!req.body || !req.body.taskId) {
        return res.status(400).json({ error: "Task not Found" });
    }
    const taskId = parseInt(req.body.taskId);
    try {
        const updatedTask = await prisma.user.update({
            where: { id: taskId },
            data: req.body,
        });
        res.json(updatedTask);
    } catch(error: any) {
        return res.status(500).json({ error: error.message });
    }
}

async function Taskdelete(req: NextApiRequest, res: NextApiResponse) {
    try {
        const taskId = req.body.taskId;
        const deletedResource = await prisma.task.delete({
            where: {id: taskId},
        })
        res.json({ message: `Deleted resource with ID ${deletedResource.id}` });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete task" });
    }
}
