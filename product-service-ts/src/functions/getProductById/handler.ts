import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import * as productList from '../../mocked-data/productList.json';

const productsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const id = event?.pathParameters?.id
  return formatJSONResponse({
    ...Array.from(productList).find(product => product.id === id) || {}
  });
}

export const getProductById = middyfy(productsById);
