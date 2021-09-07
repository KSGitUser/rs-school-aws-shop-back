import type { AWS } from '@serverless/typescript';
import * as serverlessData from './.serverless/serverless-state.json'

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
    environment: Object(serverlessData).service.provider.environment,
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { products, getProductById },
};

module.exports = serverlessConfiguration;
