import { INamedHrefEntity } from '@nusantara/models';

export enum ProviderChoices {
  ZENDESK = 'zendesk',
}

export interface IConfigChat extends INamedHrefEntity {
  provider: ProviderChoices;
  widgetCode: string;
  isDefault: boolean;
}
