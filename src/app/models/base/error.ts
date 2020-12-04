export interface IError {
  message: string;
  details?: INestedErrorDetail[];
}

export interface INestedErrorDetail extends IErrorDetail{
  details?: IErrorDetail[];
}

export interface IErrorDetail {
  field: string;
  message: string;
}
