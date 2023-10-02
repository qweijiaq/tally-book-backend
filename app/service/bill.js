'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  async addBill(params) {
    const { app } = this;
    try {
      await app.mysql.insert('bill', params);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getBill(id) {
    const { app } = this;
    const QUERY_STRING =
      'id, pay_type, amount, date, type_id, type_name, remark';
    const sql = `select ${QUERY_STRING} from bill where user_id = ${id}`;
    try {
      const res = await app.mysql.query(sql);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = BillService;
