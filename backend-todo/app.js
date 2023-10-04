const express = require('express');
const cors = require('cors');
const router = express.Router();
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/mydb')
  .then(() => {
    console.log('MongoDB Connect');
    // İşlemlerinizi burada devam ettirebilirsiniz.
  })
  .catch(err => {
    console.error(err);
  });

const todoSchema = new mongoose.Schema({
  id:Number,
  title: String,
  description: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todos', todoSchema);

app.get('/', (req, res) => {
  res.send('Todo Uygulaması Backend');
});

app.get('/todos', async (req, res) => {
  try {
    console.log('Selam')
    const todos = await Todo.find({ completed: false });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Görevleri alırken bir hata oluştu' });
  }
});

app.get('/todos/done', async (req, res) => {
  try {
    const doneTodos = await Todo.find({ completed: true });
    res.json(doneTodos);
  } catch (err) {
    res.status(500).json({ error: 'Yapılan görevleri alırken bir hata oluştu' });
  }
});

app.put('/todos/:id', async (req, res) => {
  const taskId = req.params.id;
  console.log(taskId)
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(taskId, { completed: true }, { new: true });

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Belirtilen görev bulunamadı' });
    }

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Görev güncellenirken bir hata oluştu' });
  }
});

app.post('/todos', async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const newTodo = new Todo({ title, description, completed });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Görev oluşturulurken bir hata oluştu' });
  }
});
app.delete('/todos/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(taskId);

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Belirtilen görev bulunamadı' });
    }

    res.json(deletedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Görev silinirken bir hata oluştu' });
  }
});


// Server'ı dinlemeye başlayın
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor.`);
});