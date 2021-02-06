import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import fs from 'fs';
import { sequelize } from './sequelize';

import { IndexRouter } from './index.router';

import { V0MODELS } from './model.index';

(async () => {
  await sequelize.addModels(V0MODELS);
  await sequelize.sync();


  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  //CORS Should be restricted
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get("/v0/filteredimage", async (req, res) => {
    const imageUrl: string = req.query['image_url'];
    if (!imageUrl) {
      res.status(400).send({"message": 'Please provide image url in request param "image_url"'});
    }
    const fileStatus = await filterImageFromURL(imageUrl);
    try {
      switch(fileStatus.status) {
        case 404:
          res.status(404).send({'message': 'Unable to process file. Please check whether the file at url exists'});
        case 500:
          res.status(500).send({'message': 'Something went wrong! Unable to send data'});
        case 200:
          if(fs.existsSync(fileStatus.filePath)) {
            res.status(200).sendFile(fileStatus.filePath, async (success, err) => {
              await deleteLocalFiles([fileStatus.filePath]);
              console.log(`Deleted file ${fileStatus.filePath}`)
            });
          } else {
            res.status(500).send({'message': 'Unable to process file'});
          }
      }
    } catch(err) {
      console.log(err)
      res.status(500).send({'message': 'Something went wrong! Unable to send data'});
    }
  });
  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();