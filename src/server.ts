import 'dotenv/config';
import { env } from '@/config/env.config';
import app from './app';

app.listen(env.PORT, () => {
    console.log(`Mini-Lineage remastered running on port ${env.PORT}!`);
});
