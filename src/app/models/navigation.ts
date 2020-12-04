export interface INavigation {
  href: string;
  title: string;
  fullName?: string;
  url: string;
  displayUrl?: string;
  isActive?: boolean;
  depth?: number;
  children?: INavigation[];
  page?: string;
  position?: string;
  relativeTo?: string;
}
