require('make-promises-safe');
var mongoose = require('mongoose');
var moment = require('moment');
const Wiki = require('../models/wikiModel');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

exports.list_all_wikis = function(req, res) {
  Wiki.find({ parentWiki: '', type: 'parent' })
  .populate('author', '-__v -password')
  .populate('contributors.account_id', '-__v -password')
  .exec(function(err, wiki) {
    if(err) { res.send(err); }
    res.json(wiki);
  });
};

exports.list_all_sub_wikis = function(req, res) {
  Wiki.find({ parentWiki: req.params.wikiId, type: 'child' })
  .populate('author', '-__v -password')
  .populate('contributors.account_id', '-__v -password')
  .exec(function(err, wiki) {
    if(err) { res.send(err); }
    res.json(wiki);
  });
};

exports.list_all_department_wikis = function(req, res) {
  Wiki.find({ department: req.params.departmentId, type: 'parent' })
  .select('-__v')
  .populate('author', '-__v -password')
  .populate('contributors.account_id', '-__v -password')
  .exec(function(err, wiki) {
    if(err) { res.send(err); }
    res.json(wiki);
  });
};

exports.create_a_wiki = function(req, res) {
  var new_wiki = new Wiki(req.body);
  new_wiki.save(function(err, wiki) {
    if(err) { res.send(err); }
    res.json(wiki);
  });
};

exports.filter_a_wiki = function(req, res) {
  Wiki.find(req.body)
  .populate('author', '-__v -password')
  .populate('contributors.account_id', '-__v -password')
  .exec(function(err, wiki) {
    if(err) { res.send(err); }
    res.json(wiki);
  });
};

exports.update_a_wiki = function(req, res) {
  Wiki.findById(req.params.wikiId, function(err, wiki) {
    if(err) { res.send(err); }
    if(req.files) {
      if(wiki.images) {
        var imagesArr = wiki.images;
        imagesArr = imagesArr.concat(req.files);
        req.body.images = imagesArr;
      } else {
        req.body.images = req.files
      }
    }
    if(req.body.contributor) {
      var contributor = req.body.contributor;
      var contributors = wiki.contributors;
      var index_splice = null;
      var blnSplice = false;
      contributors.forEach(function(value, index) {
        if(value.account_id == contributor) {
          blnSplice = true;
          index_splice = index;
          return;
        }
      });
      if(blnSplice) { contributors.splice(index_splice, 1); }
      contributors.push({
        "account_id" : mongoose.Types.ObjectId(contributor),
        "updated_date" : new moment().format()
      });
      if(contributors.length > 5) { contributors.shift(); }
      delete req.body.contributor;
      req.body.contributors = contributors;
    }
    req.body.updated_date = new moment().format();
    Wiki.findOneAndUpdate(
      { _id: req.params.wikiId },
      req.body,
      { 
        "fields": { "__v": 0 },
        new : true
      },
    )
    .populate('author', '-__v -password')
    .populate('contributors.account_id', '-__v -password')
    .exec(function(e, wk) {
      if(err) { res.send(err); }
      res.json(wk);
    });
  });
};

exports.delete_a_wiki = function(req, res) {
  Wiki.findById({ _id: req.params.wikiId}, function(err, wiki) {
    if(err) res.send(err);
    var wikiImages = wiki.images;
    wikiImages.forEach((item, index) => {
      if(item.path) { unlinkAsync(item.path); }
    });
    Wiki.deleteOne({ _id: req.params.wikiId}, function(err, wiki) {
      if(err) { res.send(err); }
      res.json({ message: 'Wiki successfully deleted.' });
    });
  });
};

exports.delete_wiki_file = function(req, res) {
  Wiki.findById({ _id: req.params.wikiId }, function(err, wiki) {
    if(err) { res.send(err); }
    if(!wiki) { res.json({ message: 'Wiki not found.' }); }
    var i = null;
    if(wiki.images) {
      var wikiImages = wiki.images;
      wikiImages.forEach((item, index) => {
        if(item.filename == req.params.filename) {
          if(fs.existsSync(item.path)) { unlinkAsync(item.path); }
          i = index;
        }
      });
      wikiImages.splice(i, 1);
    }
    Wiki.findOneAndUpdate(
      { _id: req.params.wikiId },
      { "images" : wikiImages },
      { 
        "fields": { "__v": 0 },
        new : true
      }
    )
    .populate('author', '-__v -password')
    .populate('contributors.account_id', '-__v -password')
    .exec(function(e, wk) {
      if(err) { res.send(err); }
      res.json(wk);
    });
  });
};
