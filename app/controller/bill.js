'use strict';

const moment = require('moment');

const Controller = require('egg').Controller;

class BillController extends Controller {
  async addBill() {
    const { ctx, app } = this;
    const { amount, type_id, type_name, date, pay_type, remark } =
      ctx.request.body;
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
    }

    try {
      const token = ctx.request.headers.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      await ctx.service.bill.addBill({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }

  async getBill() {
    const { ctx, app } = this;
    const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.query;
    try {
      const token = ctx.request.headers.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      const list = await ctx.service.bill.getBill(user_id);
      const _list = list.filter((item) => {
        if (type_id !== 'all') {
          return (
            moment(Number(item.date)).format('YYYY-MM') === date &&
            type_id === item.type_id
          );
        }
        return moment(Number(item.date)).format('YYYY-MM') === date;
      });
      const listMap = _list
        .reduce((curr, item) => {
          const date = moment(Number(item.date)).format('YYYY-MM-DD');
          if (
            curr &&
            curr.length &&
            curr.findIndex((item) => item.date === date) > -1
          ) {
            const index = curr.findIndex((item) => item.date === date);
            curr[index].bills.push(item);
          }
          if (
            curr &&
            curr.length &&
            curr.findIndex((item) => item.date === date) === -1
          ) {
            curr.push({
              date,
              bills: [item],
            });
          }
          if (!curr.length) {
            curr.push({
              date,
              bills: [item],
            });
          }
          return curr;
        }, [])
        .sort((a, b) => moment(b.date) - moment(a.date));
      const filterListMap = listMap.slice(
        (page - 1) * page_size,
        page * page_size
      );
      const __list = list.filter(
        (item) => moment(Number(item.date)).format('YYYY-MM') === date
      );
      const totalExpense = __list.reduce((curr, item) => {
        if (item.pay_type === 1) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);
      const totalIncome = __list.reduce((curr, item) => {
        if (item.pay_type === 1) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          totalExpense,
          totalIncome,
          totalPage: Math.ceil(listMap.length / page_size),
          list: filterListMap || [],
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
}

module.exports = BillController;
