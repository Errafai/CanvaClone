import { Hono } from "hono";
import { handle } from "hono/vercel";
import images from "./images";
//revert to "edge, firefox..." if planning on running on any other browser
export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app.route("/images", images)


export const GET = handle(app) 

export type AppType = typeof routes;