import { UserRoleModel, FileModel } from '.';
import { unescape } from 'html-escaper';

/*
  status :
    -1 = ขอลบบัญชี
    0  = ปิดใช้งาน
    1  = เปิดใช้งาน
*/

export class UserModel {
  constructor(data) {
    this._id = data._id? data._id: null;
    
    this.role = new UserRoleModel(data.role? data.role: {});
    
    this.firstname = data.firstname? unescape(data.firstname): null;
    this.lastname = data.lastname? unescape(data.lastname): null;

    this.username = data.username? data.username: null;
    this.email = data.email? data.email: null;
    this.telephone = data.telephone? data.telephone: null;
    this.description = data.description? unescape(data.description): null;

    this.avatar = new FileModel(
      data.avatar? data.avatar: { path: '/assets/img/default/avatar.jpg' }
    );
    
    this.apple = data.apple? data.apple: null;
    this.facebook = data.facebook? data.facebook: null;
    this.google = data.google? data.google: null;
    this.line = data.line? data.line: null;

    this.url = data.url? data.url: null;
    this.banner = new FileModel(
      data.banner? data.banner: { path: '/assets/img/default/img.jpg' }
    );

    this.fcmToken = data.fcmToken? data.fcmToken: null;
    
    this.status = data.status? data.status: 0;
  }

  isValid() { return this._id? true: false; }

  displayName() {
    if(this.firstname || this.lastname) return this.firstname+' '+this.lastname;
    else if(this.username) return this.username;
    else return '';
  }
  displayRole() {
    return this.role.displayName();
  }
  displayStatus() {
    if(this.isValid()){
      if(this.status === 1) return (<span className="ss-tag bg-success">เปิดใช้งาน</span>);
      else if(this.status === -1) return (<span className="ss-tag bg-danger">ขอลบบัญชี</span>);
      else return (<span className="ss-tag bg-warning">ปิดใช้งาน</span>);
    }else{
      return (<span className="ss-tag bg-warning">ปิดใช้งาน</span>);
    }
  }

  isSignedIn() { return this._id && this.status === 1? true: false; }

  isUser() { return this.role.isValid() && this.role.level === 1? true: false; }
  isHomeOwner() { return this.role.isValid() && this.role.level === 10? true: false; }
  isAgency() { return this.role.isValid() && this.role.level === 15? true: false; }
  isCompany() { return this.role.isValid() && this.role.level === 20? true: false; }
  isInternal() { return this.role.isValid() && this.role.level === 90? true: false; }
  isAdmin() { return this.role.isValid() && this.role.level >= 98? true: false; }
  isSuperAdmin() { return this.role.isValid() && this.role.level >= 99? true: false; }
  
  path() {
    if(this.isSignedIn()){
      if(this.isAdmin()) return '/admin';
      else if(this.isInternal()) return '/internal';
      else if(this.isCompany()) return '/company';
      else if(this.isAgency()) return '/agency';
      else if(this.isHomeOwner()) return '/owner';
      else if(this.isUser()) return '/user';
      else return '';
    }else{
      return '';
    }
  }
}
