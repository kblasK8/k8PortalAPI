'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: {
    type: String,
    required: "Provide Project A Name."
  },
  status: {
    type: [{
      type: String,
      enum: ['Pending', 'On-Going', 'Closed', 'Done']
    }],
    default: ['Pending']
  },
  department: {
    type: String
  },
  description: {
    type: String,
  },
  project_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResourceAssignmentCategory'
  },
  child_projects: [{
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    project_type: {
      type: [{
        type: String,
        enum: ['Enhancement', 'Subproject']
      }],
      default: ['Subproject']
    },
    date_added: {
      type: Date,
      default: Date.now
    }
  }],
  boards: [{
    board_name: {
      type: String,
    },
    col_number: {
      type: Number
    },
    col_names: {
      type: Array
    },
    date_added: {
      type: Date,
      default: Date.now
    }
  }],
  client: {
    type: String
  },
  owner: {
    type: String
  },
  lead: {
    type: String
  },
  mid_lead: {
    type: String
  },
  gy_lead: {
    type: String
  },
  progress: {
    type: Number
  },
  start_date: {
    type: Date
  },
  end_date: {
    type: Date
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
