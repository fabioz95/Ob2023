export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE' | 'BRAND' | 'NAME';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Relevance',
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: 'Brands', slug: 'brands', sortKey: 'BRAND', reverse: false }, // asc
  { title: 'Name', slug: 'name', sortKey: 'NAME', reverse: true },
  { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'PRICE', reverse: false }, // asc
  { title: 'Price: High to low', slug: 'price-desc', sortKey: 'PRICE', reverse: true }
];

export const TAGS = {
  collections: 'collections',
  products: 'products'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2023-01/graphql.json';

//List of partnumber for three item grid
export const THREE_ITEM_GRID = ['LR-FNTR-0001', 'DR-TBLS-0002', 'BD-BEDS-0002'];

//List of partnumber for carousel
export const CAROUSEL = [
  'DR-TBLS-0003',
  'LR-FNTR-0006',
  'LR-FNTR-CO-0002',
  'KI-CBNT-0002',
  'BR-LGHT-0001'
];

export const WCTOKEN =
  '7%2C%2FT4NZwWSjFwEpydclqNdG18aAN8q3t5iq1shVvTTGa%2BhLnn3wH76PFSrLf8Ch9Z87DzkB23teCfc4itR2nLDy%2B9WNeUk0BRBd7Y0p3q0LyX9fK3sThHrKapwS6HffVOYnFgf7VpshJaK0j6pTOo6gYxDvqQlS6LJw0QheZc0tk2r%2BUQ6ZIjJ%2FsAxmvorHOLkW7FoN9SAHyjbKk%2FA7j2mrUGCYiAfhh8ROo9FMrKxYqPK9YUsliyFXS4drN%2BtUN41';
export const WCTrustedToken = '7%2Ce2ZT2BBA9DaFkzNMgeCnX6VnwYHN%2BaTxwzYnIDzCaEA%3D';
