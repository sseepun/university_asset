const db = require('../models');

exports.initial = async () => {
  try {

    console.log('');
    console.log('Installation - User Roles');
    let count = 0;
    const data = [
      {
        condition: { level: 98 },
        data: { name: 'Admin', level: 98, isDefault: 0 }
      }, {
        condition: { level: 99 },
        data: { name: 'Super Admin', level: 99, isDefault: 0 }
      }
    ];

    var promises = [];
    data.forEach(d => {
      promises.push(
        new Promise(async (resolve, reject) => {
          let temp = await db.UserRole.findOne(d.condition).select('_id');
          if(!temp){
            await db.UserRole(d.data).save();
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
