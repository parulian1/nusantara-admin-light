export interface ICategory {
  name: string;
  pathName: string;
  productCount?: number;
  href: string;
  depth: number;
  image: string;
  parent: string;
  sourceMappings: Array<string>;
}
