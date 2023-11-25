/* eslint-disable no-unused-vars */
export enum ApiRoutes {
  ForImage = 'https://commerce-preview.sbx0133.play.hclsofy.com',
  Categories = 'https://commerce-preview.sbx0133.play.hclsofy.com/search/resources/api/v2/categories?storeId=11&depthAndLimit=11%2C11&contractId=-11005&langId=-1',
  Products = 'https://commerce-preview.sbx0133.play.hclsofy.com/search/resources/api/v2/products?storeId=11&categoryId=##categoryId##&limit=12&offset=0&contractId=-11005&currency=USD&langId=-1&profileName=HCL_V2_findProductsByCategoryWithPriceRange',
  Product = 'https://commerce-preview.sbx0133.play.hclsofy.com/search/resources/api/v2/products?storeId=11&partNumber=##partNumber##&catalogId=11501&contractId=-11005&langId=-1',
  ProductThree = 'https://commerce-preview.sbx0133.play.hclsofy.com/search/resources/api/v2/products?storeId=11&partNumber=##partNumber1##&partNumber=##partNumber2##&partNumber=##partNumber3##&catalogId=11501&contractId=-11005&langId=-1',
  ProductCarousel = 'https://commerce-preview.sbx0133.play.hclsofy.com/search/resources/api/v2/products?storeId=11&catalogId=11501&contractId=-11005&langId=-1',
  ProductSearch = 'https://commerce-preview.sbx0133.play.hclsofy.com/search/resources/api/v2/products?storeId=11&limit=12&offset=0&contractId=-11005&currency=USD&langId=-1&profileName=HCL_V2_findProductsBySearchTermWithPrice&searchTerm=##SEARCHTERM##'
}
