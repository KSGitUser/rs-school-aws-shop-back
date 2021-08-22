'use strict';

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        productName: "Picture name",
        price: 10000
      },
    ),
  };
};
