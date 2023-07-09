import { unescape } from 'html-escaper';

export class AlertModel {
  constructor(data) {
    this.loading = data.loading? data.loading: false;
    this.status = data.status? data.status: false;
    this.type = data.type? data.type: '';
    this.message = data.message? unescape(data.message): '';
    this.errors = data.errors? data.errors: [];
  }
}
