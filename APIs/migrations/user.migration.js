const db = require('../models');
const bcrypt = require('bcryptjs');

exports.initial = async () => {
  try {

    console.log('');
    console.log('Installation - Users');
    let count = 0;
    const userRoleInternal = await db.UserRole.findOne({ level: 90 }).select('_id');
    const userRoleAdmin = await db.UserRole.findOne({ level: 98 }).select('_id');
    const userRoleSuperAdmin = await db.UserRole.findOne({ level: 99 }).select('_id');

    const data = [
      {
        condition: { username: 'Admin' },
        data: {
          role: userRoleAdmin,
          firstname: 'General', lastname: 'Admin', username: 'Admin',
          email: 'admin@gmail.com', password: 'aaaa1!', status: 1
        }
      }, {
        condition: { username: 'SuperAdmin' },
        data: {
          role: userRoleSuperAdmin,
          firstname: 'Super', lastname: 'Admin', username: 'SuperAdmin',
          email: 'superadmin@gmail.com', password: 'aaaa1!', status: 1
        }
      },
    ];

    var promises = [];
    data.forEach(d => {
      promises.push(
        new Promise(async (resolve, reject) => {
          let temp = await db.User.findOne(d.condition).select('_id');
          if(!temp){
            let salt = await bcrypt.genSalt(10);
            let bcryptPassword = await bcrypt.hash(d.data.password, salt);
            await db.User({ ...d.data, password: bcryptPassword }).save();
            count += 1;
          }
          resolve(true);
        })
      );
    });
    await Promise.all(promises);
    console.log(' - Completed');
    console.log(`   - Created ${count} records`);

  } catch (err) {
    console.log(err);
  }
}
