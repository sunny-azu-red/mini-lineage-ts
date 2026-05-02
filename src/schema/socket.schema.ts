import { z } from 'zod';

export const SocketPingEventSchema = z.object({
    timestamp: z.number().int().positive(),
});

export type SocketPingEventPayload = z.infer<typeof SocketPingEventSchema>;
