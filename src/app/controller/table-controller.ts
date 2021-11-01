import TableService from "@/app/service/table-service";
import { Context } from "koa";

class TableController {
  private service: TableService = new TableService();

  transform_table = (ctx: Context) => {
    let src: String = ctx.request.body.src;
    let tar: String = ctx.request.body.tar;
    ctx.body = {
      "res": this.service.transform_table(src, tar)
    };
  }
}

export default new TableController;
