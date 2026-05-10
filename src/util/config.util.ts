import { LOCALE, HP_CONFIG } from '@/constant/game.constant';

export const getSharedConfig = () => ({
    lowHealthThreshold: HP_CONFIG.lowHealthThreshold,
    locale: LOCALE,
});
