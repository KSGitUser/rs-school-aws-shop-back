import type { AWS } from '@serverless/typescript';

// import hello from '@functions/hello';
import products from '@functions/products';
import getProductById from '@functions/getProductById';

const serverlessConfiguration: AWS = {
  service: 'product-service-ts',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: 'rs-lesson4-instance.c5zslgpyiceh.eu-west-1.rds.amazonaws.com',
      PG_PORT: '5432',
      PG_DATABASE: 'lesson4',
      PG_USERNAME: 'postgres',
      PG_PASSWORD: 't5IJuxwe9Lxh1VJ9A5uh'
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { products, getProductById },
};

module.exports = serverlessConfiguration;
