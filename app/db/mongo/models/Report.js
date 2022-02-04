const { Schema, model } = require('mongoose');

const report = new Schema({ 
    user_hash_id: {
        type: String,
        required: true,
    },
    user_report_id: {
        type: String,
        required: true,
    }
}, {
    collection: 'report'
}); 
const Report = model('Report', report);
module.exports = Report;