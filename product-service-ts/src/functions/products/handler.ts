import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import * as productList from './productList.json';

const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(event);
  return formatJSONResponse({
    products: [...Array.from(productList)]
  });
}

export const getProductsList = middyfy(getProducts);
