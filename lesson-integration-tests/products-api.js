const express = require('express');
const util = require('util');
const bodyParser = require('body-parser');
const ProductsService = require('./products-service');

// A typical Express setup
const expressApp = express();
const router = express.Router();
expressApp.use(bodyParser.json());
expressApp.use('/product', router);
defineAllRoutes(router);
expressApp.listen(3000);

// Define the routes
function defineAllRoutes(router) {
    router.post('/', async (req, res, next) => {
        try {
            console.log(`Products API was called to add new product ${util.inspect(req.body)}`);

            // save to DB (Caution: simplistic code without layers and validation)
            const newProductResponse = await new ProductsService().addProduct(req.body);

            res.json(newProductResponse).end();
        } catch (error) {
            if (error.name === 'invalidInput') {
                res.status(400).end();
            } else if (error.name === 'duplicated') {
                res.status(409).end();
            } else {
                res.status(500).end();
            }
        }
    });


    // get existing products
    router.get('/:name', async (req, res, next) => {
        console.log(`Products API was called to get product by name ${req.params.name}`);
        const resultProduct = await new ProductsService().getProductsByName(req.params.name);
        res.json(resultProduct).end();
    });
}

module.exports = expressApp;