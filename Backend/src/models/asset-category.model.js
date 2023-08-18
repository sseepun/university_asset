import { FileModel } from '.';
import { unescape } from 'html-escaper';

export class AssetCategoryModel {
  constructor(data) {
    this._id = data._id? data._id: null;
    
    this.name = data.name? unescape(data.name): null;
    this.description = data.description? unescape(data.description): null;
    this.url = data.url? data.url: null;
    
    this.image = new FileModel(data.image? data.image: {});
    this.gallery = data.gallery && data.gallery.length 
      ? data.gallery.map(d => new FileModel(d)): [];

    this.order = data.order? data.order: 1;
    this.status = data.status? data.status: 0;
  }

  isValid() {
    return this._id? true: false;
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
