'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    // const { ctx } = this;
    // ctx.body = 'hi, egg';
    const { ctx } = this;
    const { id } = ctx.query;
    ctx.body = id;
  }

  // 获取用户信息
  async getUser() {
    const { ctx } = this;
    const result = await ctx.service.home.getUser();
    ctx.body = result;
  }

  // 添加用户
  async addUser() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    try {
      await ctx.service.home.addUser(name);
      ctx.body = {
        code: 200,
        msg: '添加成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '添加用户失败',
        data: null,
      };
    }
  }

  // 编辑用户
  async editUser() {
    const { ctx } = this;
    const { id, name } = ctx.request.body;
    try {
      await ctx.service.home.editUser(id, name);
      ctx.body = {
        code: 200,
        msg: '编辑成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '编辑失败',
        data: null,
      };
    }
  }

  // 删除用户
  async deleteUser() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      await ctx.service.home.deleteUser(id);
      ctx.body = {
        code: 200,
        msg: '删除成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '删除失败',
        data: null,
      };
    }
  }
}

module.exports = HomeController;
