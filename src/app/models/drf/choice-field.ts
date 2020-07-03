import { IField } from './field';
import { IChoice } from './choice';

export interface IChoiceField extends IField {
  choices: Array<IChoice>;
}
