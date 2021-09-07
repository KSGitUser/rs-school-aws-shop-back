import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import * as productList from '../../mocked-data/productList.json';
import { Client, ClientConfig } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions:ClientConfig = {
  host: PG_HOST,
  port: +PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
}

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
     create table if not exists todo_list (
       id serial primary key,
       list_name text,
       list_description text
     )
    `);
    console.log('Connect to DB');
    console.log(dbResult);
  } finally {
    client.end();
  }
}


export const getProductsList = middyfy(getProducts);
