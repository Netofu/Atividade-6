import express from 'express';
import { AppDataSource } from './data-source';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', router);

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });
