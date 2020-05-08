/*
 * Common data structure interfaces returned from the Nusantara APIs.
 */
import {HttpResponse} from '@angular/common/http';


/**
 * Standard convention for links to related resources, returned from our API.
 */
export interface IEntityHref {
  name: string;
  href: string;
}

export interface IDrfOptionsResponse {
  name: string;
  description: string;
  renders: string[];
  parses: string[];
  actions: {
    GET: object;
    POST: object;
    PUT: object;
  };
}

export interface IDrfField {
  type: string;
  required: boolean;
  readOnly: boolean;
  label: string;
}

export interface IChoiceField extends IDrfField {
  choices: Array<IChoiceFieldChoice>;
}

export interface IChoiceFieldChoice {
  value: string;
  displayName: string;
}
