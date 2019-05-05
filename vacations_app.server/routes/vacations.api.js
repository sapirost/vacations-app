var express = require('express');
var router = express.Router();
var vacModule = require('../modules/vacations.module');
var usermodule = require('../modules/users.module')
const multer = require("multer");
var path = require('path');
var fs = require('fs');
var socketHelper =require('../utils/sockethelper');

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
        cb (null, 'public/uploads')
   },
   filename: function (req, file, cb) {
     cb(null, Date.now() + '-' +file.originalname )
   }
});

const upload = multer({storage: storage}).single('file');

router.post("/addvac", function (req, res) {
     upload(req, res, async function (err) {
          if (err instanceof multer.MulterError) {
              return res.status(500).json(err)
          } else if (err) {
              return res.status(500).json(err)
          }
    
          await vacModule.addVac(req.body.destination, req.body.description, req.body.startDate,
          req.body.endDate, parseInt(req.body.price), path.basename(req.file.path));
          
          socketHelper.updateClient({vacationID: 'new'});
          return res.status(200).json({msg:true})
   })
});

router.post("/updatevac", async function (req, res) {
  let imgFile;
   upload(req, res, async function (err) {
     if (req.file !== undefined) 
       imgFile =  path.basename(req.file.path);
     else
       imgFile = path.basename(req.body.imgShown);

     if (err instanceof multer.MulterError) {
         return res.status(500).json(err)
     } else if (err) {
         return res.status(500).json(err)
     }

     await vacModule.updateVac(req.body.destination, req.body.description, req.body.startDate,
       req.body.endDate, parseInt(req.body.price), imgFile, req.body.vacationID);

     socketHelper.updateClient({vacationID: parseInt(req.body.vacationID)});
     return res.status(200).json({msg:true})
   })     
})

router.post("/updatefollowers", async function (req, res) {
   await vacModule.updateVacFollow(req.body.following, req.body.vacationID);
   let results = await usermodule.findFavoritesArray(req.session.username);
   let jsonData = await JSON.parse(results[0].favoriteVacations);

   if (req.body.following === 'increase')
     jsonData.push(req.body.vacationID);
   else {
        let index = jsonData.indexOf(req.body.vacationID);
        if(index > -1)
          jsonData.splice(index,1);
   }  
   jsonData = JSON.stringify(jsonData);
   await usermodule.updateFavoritesArray(req.session.username, jsonData)
   .then (res => {
     res.json(res);
   })
   .catch(err => {
     res.json(err);
   })
})

router.get('/getallvac', async (req, res, next) => {
     try {
          let vacations = await vacModule.getAllVac();
          let favorites = await usermodule.findFavoritesArray(req.session.username);
          favorites = await JSON.parse(favorites[0].favoriteVacations);
          let newVacations1 = [], newVacations2 = [];

          if (favorites.length > 0) {  
               vacations.map (v => {
                    let found = favorites.find (f => { return  v.ID === f });
                    if (found != undefined)
                         newVacations1.push(v);
                    else
                         newVacations2.push(v);
               })
               var newVacations3 = newVacations1.concat(newVacations2); 
               res.json(newVacations3);
          }
          else
               res.json(vacations);
     } 
     catch(err) { res.json(err) };      
});


router.get('/getimg/:name', (req, res, next) => {
     var place = path.resolve(".");
     var image = (path.join(place, "public\\uploads\\",req.params.name));
     if(!fs.existsSync(image)){
          image = path.join(place, "public\\uploads\\","404error.jpeg");
     }
     res.sendFile(image);
})

router.post('/deletevac', async (req, res, next) => {
     await vacModule.deleteVac(req.body.id);
     socketHelper.updateClient({vacationID: req.body.id});
     res.json({msg:true})
});

module.exports = router;