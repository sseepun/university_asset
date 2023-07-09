export class SettingModel {
  constructor(data) {
    this._id = data._id? data._id: null;
    this.name = data.name? data.name: null;
    this.value = data.value? data.value: null;
  }

  isValid() {
    return this._id? true: false;
  }
}
