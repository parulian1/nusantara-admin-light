export interface IContentDetails {
  duration: string; // iso8601 duration field
  dimension: '2d' | '3d';
  caption: string;
  licensedContent: boolean;
  contentRating: any;
  projection: string;
}
