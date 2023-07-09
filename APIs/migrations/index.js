const UserRoleMigration = require('./user-role.migration');
const UserMigration = require('./user.migration');

exports.initial = async () => {
  try {
    await UserRoleMigration.initial();
    await UserMigration.initial();

    console.log();
    console.log('Installation Completed');

  } catch (err) {
    console.log(err);
  }
}