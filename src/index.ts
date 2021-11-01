require("module-alias/register");
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

import Application from "koa";
import appRouter from "@/app/router";
import Router from "koa-router";

const app: Application = new Koa();
const router: any = new Router();

appRouter.forEach(route => router[route.method](route.path, route.action));

app.use(bodyParser());
app.use((router as Router).routes());
app.listen(12315);
