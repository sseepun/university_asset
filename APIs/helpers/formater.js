const moment = require('moment');

const formater = {

  number: (val, digits=2) => {
    return (val).toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  date: (format='YYYY-MM-DD', dateString='') => {
    if(dateString) return moment(new Date(dateString)).format(format);
    else return moment(new Date()).format(format);
  },
  
  cleanTelephone: (val) => {
    return val.replace(/^0/, '+66').replaceAll('-', '');
  },
  cleanKeyword: (val) => {
    return `${val}`.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  },
  
  companyAddress: (data=null) => {
    if(!data){
      return {
        address: '',
        subdistrict: '',
        district: '',
        province: '',
        zipcode: '',
        lat: null,
        lng: null,
      };
    }else{
      return {
        address: data.address? data.address: '',
        subdistrict: data.subdistrict? data.subdistrict: '',
        district: data.district? data.district: '',
        province: data.province? data.province: '',
        zipcode: data.zipcode? data.zipcode: '',
        lat: data.lat? Number(data.lat): null,
        lng: data.lng? Number(data.lng): null,
      };
    }
  },

  propertyAddress: (data=null) => {
    if(!data){
      return {
        address: '',
        subdistrict: '',
        district: '',
        province: '',
        zipcode: '',
        lat: null,
        lng: null,
      };
    }else{
      return {
        address: data.address? data.address: '',
        subdistrict: data.subdistrict? data.subdistrict: '',
        district: data.district? data.district: '',
        province: data.province? data.province: '',
        zipcode: data.zipcode? data.zipcode: '',
        lat: data.lat? Number(data.lat): null,
        lng: data.lng? Number(data.lng): null,
      };
    }
  },

  userDetail: (detail) => {
    let result = {};
    if(detail){
      if(detail['telephone']) result['telephone'] = detail['telephone'];
      if(detail['address']) result['address'] = detail['address'];
      if(detail['subDistrict']) result['subDistrict'] = detail['subDistrict'];
      if(detail['district']) result['district'] = detail['district'];
      if(detail['province']) result['province'] = detail['province'];
      if(detail['zipcode']) result['zipcode'] = detail['zipcode'];
      if(detail['otherInfo']) result['otherInfo'] = detail['otherInfo'];
    }
    return result;
  },

};

module.exports = formater;