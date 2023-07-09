export class PaginateModel {
  constructor(data) {
    this.page = data.page? Number(data.page): 1;
    this.pp = data.pp? Number(data.pp): 10;
    this.total = data.total? Number(data.total): 0;
  }

  totalPages() {
    return this.pp > 0? Math.ceil(this.total / this.pp): 0;
  }

  anchorId() {
    return (this.page - 1) * this.pp + 1;
  }
}
