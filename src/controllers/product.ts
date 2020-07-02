import { Request, Response, NextFunction } from 'express';
const logger = require('../util/logger').getAccessLogger();
import { Product } from '../models/Product';

const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    Product.find({}, (err, products) => {
      if (err) {
        return reject(err);
      } else {
        resolve(products);
      }
    });
  });
};

export const getProducts = (req: any, res: any) => {
  getAllProducts()
    .then(products => {
      console.log('Products Info: ');
      return res.status(201).send(products);
    })
    .catch(err => {
      console.log(err);
    });
};

export const postProductsInCart = (req: any, res: any) => {
  const cartProducts: any = [];
  let id = null;

  const cart = req.body;
  console.log(cart);
  if (!cart) {
    return res.json(cartProducts);
  } else {
    getAllProducts()
      .then(function(products: any): any {
        const length = products.length;
        for (let i = 0; i < length; i++) {
          id = products[i].id;

          if (cart.hasOwnProperty(id)) {
            products[i].quantity = cart[id];
            cartProducts.push(products[i]);
          }
          return res.status(201).send(cartProducts);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
