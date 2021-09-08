import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { Client, ClientConfig } from 'pg';
import { dbOptions } from '@libs/dbOptions';

// const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
//   return formatJSONResponse({
//     products: [...Array.from(productList)]
//   });
// }

const getProducts = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const dbResult = await client.query(`
     select id, title, description, price, count from products p left join stocks s on p.id = s.product_id;
    `);
    console.log('Connect to DB');
    console.log(dbResult.rows);
    return formatJSONResponse({
    products: Array.from(dbResult.rows || [])
  });
  } finally {
    client.end();
  }
}


export const getProductsList = middyfy(getProducts);
