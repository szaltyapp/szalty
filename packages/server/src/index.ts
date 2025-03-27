import express from 'express';
import { APP_NAME } from '@szalty/common';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ message: `${APP_NAME} API is running` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
