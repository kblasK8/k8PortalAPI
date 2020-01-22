const mongoose = require('mongoose');
const moment = require('moment');
const Wiki = require('../models/wikiModel');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

exports.list_all_wikis = (req, res) => {
  Wiki.find(
    { parentWiki: '', type: 'parent' }
  )
  .select('-__v')
  .populate('author', '-__v -password')
  .populate('contributors.account_id', '-__v -password')
  .exec(
    (err, wikis) => {
      if(err) { res.send(err); }
      res.json(wikis);
    }
  );
}

exports.read_a_wiki = (req, res) => {
  Wiki.findById(req.params.wikiId)
  .select('-__v')
  .populate('author', '-__v -password')
  .populate('contributors.account_id', '-__v -password')
  .exec(
    (err, wiki) => {
      if(err) { res.send(err); }
      res.json(wiki);
    }
  );
}

exports.list_all_department_wikis = (req, res) => {
  var pageNo = parseInt(req.params.pageNo);
  var perPage = parseInt(req.params.perPage);
  var query = { department: req.params.departmentId, type: 'parent' }
  Wiki.find(query)
  .limit(perPage)
  .skip(perPage * (pageNo - 1))
  .sort({
    name: 'asc'
  })
  .select('-__v')
  .populate('author', '-__v -password')
  .populate('contributors.account_id', '-__v -password')
  .exec(
    (err, data) => {
      if(err) { res.send(err); }
      Wiki.estimatedDocumentCount(query).exec(
        (e, count) => {
          if(e) { res.send(e); }
          var response = {
            data: data,
            page: pageNo,
            pages: Math.ceil(count / perPage)
          }
          res.json(response);
        }
      );
    }
  );
}

exports.create_a_wiki = (req, res) => {
  var new_wiki = new Wiki(req.body);
  new_wiki.save(
    (err, wiki) => {
      if(err) { res.send(err); }
      var obj = wiki.toObject();
      delete obj.__v;
      res.json(obj);
    }
  );
}

exports.filter_a_wiki = (req, res) => {
  Wiki.find(req.body)
  .select('-__v')
  .populate('author', '-__v -password')
  .populate('contributors.account_id', '-__v -password')
  .exec(
    (err, wikis) => {
      if(err) { res.send(err); }
      res.json(wikis);
    }
  );
}

exports.update_a_wiki = (req, res) => {
  Wiki.findById(
    req.params.wikiId,
    (err, wiki) => {
      if(err) { res.send(err); }
      if(!wiki) {
        res.json({ message: 'Wiki not found.' });
        return;
      }
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
        contributors.forEach(
          (value, index) => {
            if(value.account_id == contributor) {
              blnSplice = true;
              index_splice = index;
              return;
            }
          }
        );
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
      .exec(
        (e, wk) => {
          if(err) { res.send(err); }
          res.json(wk);
        }
      );
    }
  );
}

exports.delete_a_wiki = (req, res) => {
  Wiki.findById(
    { _id: req.params.wikiId},
    (err, wiki) => {
      if(err) res.send(err);
      if(!wiki) { res.json({ message: 'Wiki not found.' }); }
      var wikiImages = wiki.images;
      wikiImages.forEach(
        (item, index) => {
          if(item.path) {
            if(fs.existsSync(item.path)) { unlinkAsync(item.path); }
          }
        }
      );
      Wiki.deleteOne(
        { _id: req.params.wikiId},
        (err, wiki) => {
          if(err) { res.send(err); }
          res.json({ message: 'Wiki successfully deleted.' });
        }
      );
    }
  );
}

exports.delete_wiki_file = (req, res) => {
  Wiki.findById(
    { _id: req.params.wikiId },
    (err, wiki) => {
      if(err) { res.send(err); }
      if(!wiki) { res.json({ message: 'Wiki not found.' }); }
      var i = null;
      if(wiki.images) {
        var wikiImages = wiki.images;
        wikiImages.forEach(
          (item, index) => {
            if(item.filename == req.params.filename) {
              if(fs.existsSync(item.path)) { unlinkAsync(item.path); }
              i = index;
            }
          }
        );
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
      .exec(
        (e, wk) => {
          if(err) { res.send(err); }
          res.json(wk);
        }
      );
    }
  );
}
