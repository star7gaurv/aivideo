export interface AdFilmProps {
  brandColor?: string;
  logoUrl?: string;
  ctaText?: string;
  productImageUrl?: string;
  productName?: string;
  tagline?: string;
  musicFilePath?: string;
}

export const defaultAdFilmProps: AdFilmProps = {
  brandColor:      '#7c3aed',
  logoUrl:         undefined,
  ctaText:         'Shop Now',
  productImageUrl: undefined,
  productName:     'Your Product',
  tagline:         'Experience the difference',
};
