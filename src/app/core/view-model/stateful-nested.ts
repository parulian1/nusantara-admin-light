
export enum State {
  new,
  updated,
  deleted ,
}


export interface IStatefulNested<T> {
  state: State;
  object: T;
}
