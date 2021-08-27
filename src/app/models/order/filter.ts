export interface IOption {
  option: string;
  title: string;
}

export interface IOrderFilter {
  platform: Array<IOption>;
  orderStatus: Array<IOption>;
  logistics: Array<IOption>;
  isTesting: boolean;
}

export interface IOrderFilterValue {
  date: {
    type: string,
    start: string,
    end: string,
  }
  platform: number,
  status: string,
  logistic: string,
  q: string,
  isTesting: string,
}
