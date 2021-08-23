// import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductsFunction`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        // request: {
        //   schema: {
        //     'application/json': schema
        //   }
        // }
      }
    }
  ]
}
