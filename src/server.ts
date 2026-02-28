import express from 'express';
import cors from 'cors';
import todoRouter from './routes/todo.routes.js'
import { errorHandler } from './middleware/error.middleware.js'

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/todos', todoRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
