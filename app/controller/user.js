'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 用户注册
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    // 用户名未输入
    if (!username) {
      ctx.body = {
        code: '500',
        msg: '用户名不能为空',
        data: null,
      };
      return;
    }
    // 密码未输入
    if (!password) {
      ctx.body = {
        code: '500',
        msg: '密码不能为空',
        data: null,
      };
      return;
    }
    // 验证数据库内是否已经有该账户名
    const userInfo = await ctx.service.user.getUserByName(username);
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: '500',
        msg: '该用户名已被注册，请重新输入',
        data: null,
      };
      return;
    }
    // 默认头像
    const defaultAvatar =
      'http://image.wei-jia.top:7777/users/1/avatar?size=small';
    // 存入数据库
    const result = await ctx.service.user.register({
      username,
      password,
      signature: '爱自己才是终身浪漫的开始',
      avatar: defaultAvatar,
    });
    if (result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null,
      };
    }
  }

  // 用户登录
  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    // 根据用户名，在数据库查找对应的 id 操作
    const userInfo = await ctx.service.user.getUserByName(username);
    // 没找到说明用户不存在
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账号不存在',
        data: null,
      };
      return;
    }
    // 找到用户，并且判断输入密码与数据库中用户密码是否相等
    if (userInfo && password !== userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '用户名或密码错误',
        data: null,
      };
      return;
    }
    // 生成 token 加盐
    // app.jwt.sign 方法接收两个参数
    // 第一个参数为对象，对象内是需要加密的内容
    // 第二个参数为加密字符串
    const token = app.jwt.sign(
      {
        id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 * 30, // token 有效期为 30 天
      },
      app.config.jwt.secret
    );

    ctx.body = {
      code: 200,
      message: '登录成功',
      data: {
        token,
      },
    };
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;
    const defaultAvatar =
      'http://image.wei-jia.top:7777/users/1/avatar?size=small';
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature || '',
        avatar: userInfo.avatar || defaultAvatar,
      },
    };
  }

  // 修改用户信息 —— 个性签名或头像
  async editUserInfo() {
    const { ctx, app } = this;
    // 通过 post 请求，在请求体中获取签名字段 signature
    const { signature = '', avatar = '' } = ctx.request.body;

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const userId = decode.id;
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      await ctx.service.user.editUserInfo({
        ...userInfo,
        signature,
        avatar,
      });

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          id: userId,
          signature,
          username: userInfo.username,
          avatar,
        },
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserController;
