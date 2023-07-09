const utility = {
  
  nextDays: (n=0, fromDate=null) => {
    let today = fromDate? new Date(fromDate): new Date();
    return new Date(today.setDate(today.getDate() + n));
  },
  nexHours: (n=0) => {
    let today = new Date();
    return new Date(today.setHours(today.getHours() + n));
  },
  isToday: (date) => {
    let today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  },

  shuffle: (array) => {
    let currentIndex = array.length,  randomIndex;
    while(currentIndex != 0){
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  },

  cleanSort: (sort={}, dataFilter=null) => {
    if(dataFilter && dataFilter.sort){
      if(dataFilter.sort.includes('desc-')){
        let key = dataFilter.sort.replace('desc-', '');
        let temp = {};
        temp[key] = -1;
        delete sort[key];
        sort = Object.assign(temp, sort);
      }else if(dataFilter.sort.includes('asc-')){
        let key = dataFilter.sort.replace('asc-', '');
        let temp = {};
        temp[key] = 1;
        delete sort[key];
        sort = Object.assign(temp, sort);
      }
    }
    return sort;
  },

};

module.exports = utility;