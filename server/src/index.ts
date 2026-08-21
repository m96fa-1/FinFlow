import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth'
import categoriesRouter from './routes/categories'
import transactionsRouter from './routes/transactions'
import budgetsRouter from './routes/budgets'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/budgets', budgetsRouter);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});