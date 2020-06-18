/**
 * An image, or youtube video link that is associated with
 * a product.
 */
export interface IProductMedia {
  href: string;
  type: string;
  youtubeVideoId?: string;
  product?: string;
  image?: string;
}
