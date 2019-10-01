'use strict';

module.exports = function(app) {
  var note = require('../controllers/noteController');

  // note routes
  app.route('/notes')
    .get(note.list_all_notes)
    .post(note.create_a_note);

  app.route('/notes/:noteId')
    .get(note.read_a_note)
    .put(note.update_a_note)
    .delete(note.delete_a_note);
}
