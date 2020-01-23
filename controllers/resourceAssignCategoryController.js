const mongoose = require('mongoose');
const RecAssignCat = require('../models/resourceAssignmentCategoryModel');
const Project = require('../models/projectModel');
var countUseProject = (racId, res) => {
  return new Promise((resolve, reject) => {
    Project.countDocuments(
      { project_category : racId },
      (err, count) => {
        if(err) { res.send(err); }
        resolve(count);
      }
    );
  });
}

exports.list_all_rac = (req, res) => {
  RecAssignCat.find()
  .select('-__v')
  .exec(
    (err, racs) => {
      if(err) { res.send(err); }
      res.json(racs);
    }
  );
}

exports.create_a_rac = (req, res) => {
  var new_rac = new RecAssignCat(req.body);
  new_rac.save(
    (err, rac) => {
      if(err) {
        res.send(err);
        return;
      }
      var obj = rac.toObject();
      delete obj.__v;
      res.json(obj);
    }
  );
}

exports.read_a_rac = (req, res) => {
  RecAssignCat.findById(req.params.racId)
  .select('-__v')
  .exec(
    (err, rac) => {
      if(err) { res.send(err); }
      res.json(rac);
    }
  );
}

exports.update_a_rac = (req, res) => {
  RecAssignCat.findOneAndUpdate(
    { _id: req.params.racId },
    req.body,
    {
      "fields" : { "__v" : 0 },
      new : true
    },
    (err, rac) => {
      if(err) { res.send(err); }
      res.json(rac);
    }
  );
}

exports.delete_a_rac = (req, res) => {
  (async () => {
    if(! await countUseProject(req.params.racId, res)) {
      RecAssignCat.remove(
        { _id: req.params.racId },
        (err, rac) => {
          if(err) { res.send(err); }
          res.json({ message: 'Resource Assignment Category successfully deleted.' });
        }
      );
    } else {
      res
      .status(400)
      .json({
        statusCode: 400,
        error: true,
        msg: "Resource Assignment Category currently used in Project."
      });
      return;
    }
  })();
}
