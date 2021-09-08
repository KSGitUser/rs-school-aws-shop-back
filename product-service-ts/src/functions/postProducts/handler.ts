import 'source-map-support/register';

import { formatError, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { v4 as uuidv4 } from 'uuid';

import schema from './schema';
import { Client } from 'pg';
import { dbOptions } from '@libs/dbOptions';

const postProductsList = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();
  const data = event?.body || [];
  const productsData = [];
  const stocksData = [];
  data.forEach(dataItem => {
    const uuid = uuidv4();
    productsData.push(`('${uuid}', '${dataItem.description}', '${dataItem.price}', '${dataItem.title}')`);
    stocksData.push(`('${uuid}', '${dataItem.count || 0}')`)
  })
  try {
    await client.query(`
     insert into products ("id", "description", "price", "title") values 
      ${productsData.join(',')};
    `);
    await client.query(`
      insert into stocks ("product_id", "count") values 
        ${stocksData.join(',')};
    `);
    return formatJSONResponse(data);
  } catch(e) {
     return formatError(500, "DB post operation error");
  } finally {
    client.end();
  }
}


export const postProducts = middyfy(postProductsList);
