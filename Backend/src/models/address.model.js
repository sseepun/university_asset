import dataProvinces from '../data/thai-provinces.json';
import dataDistricts from '../data/thai-districts.json';
import dataSubdistricts from '../data/thai-subdistricts.json';
import { unescape } from 'html-escaper';

export class AddressModel {
  constructor(data) {
    this._id = data._id? data._id: null;

    this.address = data.address? unescape(data.address): '';
    this.subdistrict = data.subdistrict? data.subdistrict: '';
    this.district = data.district? data.district: '';
    this.province = data.province? data.province: '';
    this.zipcode = data.zipcode? data.zipcode: '';

    this.lat = data.lat? Number(data.lat): null;
    this.lng = data.lng? Number(data.lng): null;

    this.addressText = data.addressText? unescape(data.addressText): '';

    this.telephone = data.telephone? data.telephone: '';
    this.instruction = data.instruction? unescape(data.instruction): '';

    this.selectedProvince = null;
    this.selectedDistrict = null;
    this.selectedSubdistrict = null;

    this.isPrimary = data.isPrimary? Number(data.isPrimary): 0;
    this.isSelected = data.isSelected? Number(data.isSelected): 0;
  }

  isValid() {
    return this._id? true: false;
  }

  prefixDistrict() {
    if(!this.province) return 'เขต / อำเภอ';
    else if(this.province.includes('กรุงเทพ')) return 'เขต';
    else return 'อำเภอ';
  }
  prefixSubdistrict() {
    if(!this.province) return 'แขวง / ตำบล';
    else if(this.province.includes('กรุงเทพ')) return 'แขวง';
    else return 'ตำบล';
  }

  provinces() {
    return dataProvinces;
  }
  districts() {
    if(!this.province) return [];
    else{
      let temp = dataProvinces.filter(d => d.nameTH === this.province);
      if(!temp.length){
        this.selectedProvince = null;
        this.selectedDistrict = null;
        this.selectedSubdistrict = null;
        return [];
      }else{
        this.selectedProvince = temp[0];
        this.selectedDistrict = null;
        this.selectedSubdistrict = null;
        return dataDistricts.filter(d => d.provinceId === temp[0].id);
      }
    }
  }
  subdistricts() {
    if(!this.selectedProvince || !this.district){
      this.selectedDistrict = null;
      this.selectedSubdistrict = null;
      return [];
    }else{
      let temp = dataDistricts.filter(d => d.nameTH === this.district 
        && d.provinceId === this.selectedProvince.id);
      if(!temp.length){
        this.selectedDistrict = null;
        this.selectedSubdistrict = null;
        return [];
      }else{
        this.selectedDistrict = temp[0];
        this.selectedSubdistrict = null;
        return dataSubdistricts.filter(d => d.districtId === temp[0].id);
      }
    }
  }
  zipcodes() {
    if(!this.selectedProvince || !this.selectedDistrict || !this.subdistrict){
      this.selectedSubdistrict = null;
      return [];
    }else{
      let temp = dataSubdistricts.filter(d => d.nameTH === this.subdistrict 
        && d.districtId === this.selectedDistrict.id);
      if(!temp.length){
        this.selectedSubdistrict = null;
        return [];
      }else{
        this.selectedSubdistrict = temp[0];
        return temp;
      }
    }
  }
}
