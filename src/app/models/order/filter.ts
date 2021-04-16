export interface IOption {
  option: string;
  title: string;
}

export interface IOrderFilter {
  platform: Array<IOption>;
  orderStatus: Array<IOption>;
  logistics: Array<IOption>;
}

export interface IOrderFilterValue {
  startDate: string,
  endDate: string,
  platform: number,
  status: string,
  logistic: string,
  q: string,
}