import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(event);
  return formatJSONResponse({
    products:[{ name: "Picture name"}]
  });
}

export const getProductsFunction = middyfy(getProducts);
