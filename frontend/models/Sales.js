export default class Sales {
  constructor(data) {
    this.department = data.department || '';
    this.amount = data.amount || 0;
    this.year = data.year || 0;
  }

  static fromApiResponse(apiData) {
    if (Array.isArray(apiData)) {
      return apiData.map(item => new Sales(item));
    }
    return new Sales(apiData);
  }
}
