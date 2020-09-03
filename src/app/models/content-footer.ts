export interface IContentFooter {
  href: string;
  title: string;
  fullName?: string;
  url: string;
  displayUrl?: string;
  isActive?: boolean;
  depth?: number;
  children?: IContentFooter[];
  page?: string;
  position?: string;
  relativeTo?: string;
}
