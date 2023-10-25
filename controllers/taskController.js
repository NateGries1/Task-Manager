const Task = require('../models/schema');

const createTask = async (req, res) => {
    const { title, description, done } = req.body;
    
    try {
        const task = await Task.create({ title, description, done });
    
        return res.status(201).json({
        task,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

