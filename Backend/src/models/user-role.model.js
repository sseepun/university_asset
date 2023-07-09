import { unescape } from 'html-escaper';

/*
  level :
    1  = User
    10 = Home Owner
    15 = Agency
    20 = Company Owner

    90 = Internal
    98 = Admin
    99 = Super Admin
*/

export class UserRoleModel {
  constructor(data) {
    this._id = data._id? data._id: null;
    this.name = data.name? unescape(data.name): null;
    this.level = data.level? data.level: 0;
  }

  isValid() {
    return this._id? true: false;
  }
  
  displayName() {
    if(this.isValid()) return this.name;
    else return '';
  }
  displayStatus() {
    if(this.isValid()){
      if(this.status === 1) return (<span className="ss-tag bg-success">เปิดใช้งาน</span>);
      else return (<span className="ss-tag bg-warning">ปิดใช้งาน</span>);
    }else{
      return (<span className="ss-tag bg-warning">ปิดใช้งาน</span>);
    }
  }
}
