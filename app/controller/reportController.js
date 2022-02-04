const Report = require('../db/mongo/models/Report');
const tokenService = require('../services/token');

const store = async (req, res) => {
    const user_report_id = req.body;
    const token = tokenService.findToken(req);
    const { uuid } = tokenService.verify(token);
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const report = await Report.findOneAndUpdate({ user_hash_id: uuid }, {
        user_hash_id: uuid,
        user_report_id: user_report_id.userReportId
    }, options);

    res.send({
        success: true,
        report
    })
}

module.exports = {
    store
}