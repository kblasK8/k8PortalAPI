require('make-promises-safe');
var mongoose = require('mongoose');
const Wiki = require('../models/wikiModel');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

exports.list_all_wikis = function(req, res) {
  Wiki.find({parentWiki: '', type: 'parent'}, function(err, wiki) {
    if(err) { res.send(err); }
    res.json(wiki);
  });
};

exports.list_all_sub_wikis = function(req, res) {
    Wiki.find({parentWiki: req.params.wikiId, type: 'child'}, function(err, wiki) {
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
  Wiki.find(req.body, function(err, wiki) {
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
    Wiki.findOneAndUpdate(
      { _id: req.params.wikiId },
      req.body,
      { new : true },
      function(e, wk) {
        if(e) { res.send(e); }
        res.json(wk);
      }
    );
  });
};

exports.delete_a_wiki = function(req, res) {
  Wiki.findById({ _id: req.params.wikiId}, function(err, wiki) {
    if(err) res.send(err);
    var wikiImages = wiki.images;
    wikiImages.forEach((item, index) => {
      if(item.path) unlinkAsync(item.path);
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
    var i = null;
    var wikiImages = wiki.images;
    wikiImages.forEach((item, index) => {
      if(item.filename == req.params.filename) {
        if(fs.existsSync(item.path)) {
          unlinkAsync(item.path);
        }
        i = index;
      }
    });
    delete wikiImages[i];
    Wiki.findOneAndUpdate(
      { _id: req.params.wikiId },
      { "images" : wikiImages },
      { new : true },
      function(e, wk) {
        if(e) { res.send(e); }
        res.json(wk);
      }
    );
  });
};
