export interface IAttributeForMapping {
  marketplace_attribute_name: string;
  marketplace_attribute_id: number;
  marketplace_attribute_code:string;
  marketplace_attribute_type: string;
  marketplace_attribute_option: string[] | string;
  product_class_attribute_id: number;
  product_class_attribute_type: string;
  new_attribute_name: string;
}

export interface IAttributesMapping {
  category_id: number;
  attributes: IAttributeForMapping[];
}
