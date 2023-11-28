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
  '98%2C5AGyuEOnF5sqtZb%2BlLR25Z6ZFnRSA%2F1wpVQSiQp7dtVZyp8YigF%2FlJvwxp3iwoQ79gsofdw%2BQd6cj7RUbA1QXG2vPcKL19qpM1Sr06ye323L5ZzqhlFHatQub4seie0OhWm70fCz6TuJxPi4DCHYXf%2BOJk0Dpg5JYR4qXlOO9WpkYEKzgXGD%2FKzPS9i509LHc8TlSgvLnHqJFmj%2F0LEvZSQVUhIKSx1kF74uYDnijKtyeQBttmrVtBsMFLbcddt3';
export const WCTrustedToken = '98%2Cd5IZrZdzdsc2NJJzLYzyymlKnefFkYzx4yjHI6ce%2Fqg%3D';
