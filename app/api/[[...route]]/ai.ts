import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { replicate } from "@/lib/replicate";
import z from "zod";
const app = new Hono()
    .post("/remove-bg", zValidator("json",
        z.object({
            image: z.string(),
        }),

    ), async (c) => {
        const { image } = c.req.valid("json");

    })
    .post("/generate-image",
        //add verification,
        zValidator("json", z.object({
            prompt: z.string(),
        }),
        ),
        async (c) => {
            const { prompt } = c.req.valid("json");
            const input = {
                prompt: prompt,
                aspect_ratio: "16:9",
                safety_filter_level: "block_medium_and_above"
            };

            const output: unknown = await replicate.run("google/imagen-4", { input });
            const res = output as Array<string>;
            return c.json({ data: res[0] })
        }

    );

export default app;