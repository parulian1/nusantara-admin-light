/**
 * An image, or youtube video link that is associated with
 * a product.
 */
import { MediaType } from './media.type';

export interface IProductMedia {
  href: string;
  type: MediaType;
  youtubeVideoId?: string;
  product?: string;
  image?: string;
  sortPriority?: number;
  identifier?: string;
  imageName?: string;
}
