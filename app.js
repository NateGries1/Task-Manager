const express = require('express');
const router = express.Router();

const app = express();

const taskController = require('./controllers/taskController');

router.post('/task', taskController.createTask);
router.get('/task', taskController.getTasks);
router.get('/task/:id', taskController.getTask);
router.put('/task/:id', taskController.updateTask);
router.delete('/task/:id', taskController.deleteTask);

app.use(express.json());
app.use(router);

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
