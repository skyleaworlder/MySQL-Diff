import tableController from "@/app/controller/table-controller";

export default [
  {
    path: '/transform/table',
    method: 'get',
    action: tableController.transform_table
  }
];
