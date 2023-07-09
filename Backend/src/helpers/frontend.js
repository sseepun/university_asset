import moment from 'moment';


export const appLogo = () => {
  return '/assets/img/logo.png';
};
export const appName = () => {
  return 'Property';
};

export const onMounted = () => {
  return true;
};

export const scrollToRef = (ref) => {
  if(ref && ref.current){
    window.scrollTo({ top: ref.current.offsetTop - 82, left: 0, behavior: 'smooth' });
  }
};
export const scrollToBottomRef = (ref) => {
  if(ref && ref.current){
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }
};


export const formatNumber = (value, digits=2) => {
  let val = (value / 1).toFixed(digits);
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export const formatDate = (value=null, format='DD/MM/YYYY', thai=true) => {
  let string;
  if(!value) string = moment(new Date()).format(format);
  else string = moment(new Date(String(value))).format(format);
  if(string) {
    if(thai) {
      string = string.split('/');
      return `${string[0]}/${string[1]}/${parseInt(string[2])+543}`;
    } else {
      return string;
    }
  } else {
    return '';
  }
};
export const formatTime = (value=null, format='hh:mm A') => {
  let string;
  if(!value) string = moment(new Date()).format(format);
  else string = moment(new Date(String(value))).format(format);
  if(string) {
    return string;
  } else {
    return '';
  }
};
export const formatSeconds = (sec) => {
  if(sec) {
    sec = Math.round(sec);
    let hours = Math.floor(sec/3600);
    (hours >= 1)? sec -= (hours*3600): hours = '00';
    let min = Math.floor(sec/60);
    (min >= 1)? sec -= (min*60): min = '00';
    (sec < 1)? sec = '00': void 0;
  
    (min.toString().length === 1)? min = '0'+min: void 0;    
    (sec.toString().length === 1)? sec = '0'+sec: void 0;    
    
    return hours+':'+min+':'+sec;
  } else {
    return '00:00:00';
  }
};
export const formatTextSecret = (str, showDigits=3) => {
  if(str) {
    let len = str.length;
    let res = [...str].map((d, i) => {
      if(i < len - showDigits) return '*';
      else return d;
    }).join('');
    return (<span title={str}>{res}</span>);
  } else {
    return (<></>);
  }
};

export const displayMonth = (i) => {
  let months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฏาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  return months[Number(i)];
};

export const nextDays = (n=0) => {
  let today = new Date();
  return new Date(today.setDate(today.getDate() + n));
};
export const nexHours = (n=0) => {
  let today = new Date();
  return new Date(today.setHours(today.getHours() + n));
};
export const isToday = (date) => {
  let today = new Date()
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};


export const hex2rgb = (hex) => {
  return {
    r: parseInt(hex.slice(1, 3), 16), 
    g: parseInt(hex.slice(3, 5), 16), 
    b: parseInt(hex.slice(5, 7), 16)
  };
};
