const db = require('../models');

const generator = {
  
  userCode: async (type='PPT', value=null) => {
    let count = value;
    if(!count){
      count = await db.Counting.findOne({ name: 'user', type: type });
      if(!count) count = await db.Counting({ name: 'user', type: type, value: 1 }).save();
      count = count.value;
    }

    let leading1 = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ][Math.floor(count / 10**7 / 26)];
    count %= (10**7 * 26);

    let leading2 = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ][Math.floor(count / 10**7)];
    count %= (10**7);

    let prefix = type=='PPT'? 'PPT': type;
    return `${prefix}-${leading1}${leading2}${String(count).padStart(6, '0')}`;
  },

};

module.exports = generator;