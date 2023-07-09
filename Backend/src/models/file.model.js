import { unescape } from 'html-escaper';

export class FileModel {
  constructor(data) {
    this.originalname = data.originalname? unescape(data.originalname): null;
    this.mimetype = data.mimetype? data.mimetype: null;
    this.filename = data.filename? data.filename: null;
    this.size = data.size? data.size: null;
    this.path = data.path? data.path: null;
  }

  isValid() {
    return this.path && this.size && this.filename && this.mimetype && this.originalname? true: false;
  }

  previewSrc() {
    if(['image/png'].indexOf(this.mimetype) > -1){
      return '/assets/images/file/png.svg';
    }else if(['image/jpeg', 'image/jpg'].indexOf(this.mimetype) > -1){
      return '/assets/images/file/jpg.svg';
    }else if(['application/pdf'].indexOf(this.mimetype) > -1){
      return '/assets/images/file/pdf.svg';
    }else{
      return '';
    }
  }
  displaySize() {
    if(this.size > 10**9) return `${Math.round(this.size / 10**9)} GB`;
    else if(this.size > 10**6) return `${Math.round(this.size / 10**6)} MB`;
    else if(this.size > 10**3) return `${Math.round(this.size / 10**3)} KB`;
    else return `${this.size} B`;
  }
}
