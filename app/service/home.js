const Service = require('egg').Service;

class HomeService extends Service {
  // 获取用户
  async getUser() {
    const { app } = this;
    const QUERY_STR = 'id, name';

    const sql = `select ${QUERY_STR} from list`;

    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 新增用户
  async addUser(name) {
    const { app } = this;

    try {
      const result = await app.mysql.insert('list', { name });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 编辑用户
  async editUser(id, name) {
    const { ctx, app } = this;
    try {
      let result = await app.mysql.update(
        'list',
        { name },
        {
          where: { id },
        }
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 删除用户
  async deleteUser(id, name) {
    const { ctx, app } = this;
    try {
      let result = await app.mysql.delete('list', { id });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = HomeService;
