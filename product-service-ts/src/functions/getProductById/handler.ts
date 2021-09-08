import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { Client } from 'pg';
import { dbOptions } from '@libs/dbOptions';
import { formatError } from '../../libs/apiGateway';

const productsById = async (event) => {
  const id = event?.pathParameters?.id
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const dbResult = await client.query(`select * from 
	    (select id, title, description, price, count from products p left join stocks s on p.id = s.product_id) t 
	    where t.id = '${id}';
  `);
    console.log('Connect to DB');
    console.log(dbResult.rows);
    return formatJSONResponse({
    ...(dbResult.rows[0] || {})
    });
  } catch(e) {
    return formatError(500, "DB operation error");
  }finally {
    client.end();
  }
}

export const getProductById = middyfy(productsById);
