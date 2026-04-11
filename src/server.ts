import 'dotenv/config';
import { env } from '@/config/env.config';
import { GAME_VERSION } from '@/constant/game.constant';
import app from './app';

app.listen(env.PORT, () => {
    console.log(`${GAME_VERSION} | Mini-Lineage remastered running on port ${env.PORT}!`);
});
