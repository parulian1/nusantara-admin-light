export interface IProductClass {
  name: string;
  slug: string;
  isMapped: boolean;
  categoryAttribute: string;
  attribute: string;
  category: string;
}

export interface IProductCategory {
  name: string;
  categoryId: number;
  categoryCode:string;
  hasChildren: boolean;
  childUrl: string;
}

export interface ISelectedCategory {
  categoryNames: string[];
  deepestChildId: number;
  deepestChildCode: string;
}
