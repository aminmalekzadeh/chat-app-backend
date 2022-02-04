const { auth } = require('../middleware/auth');
const LoginRouter = require('./auth/login');
const RegisterRouter = require('./auth/register');
const ContactRouter = require('./chat/contact');
const MyAccountRouter = require('./myAccount');
const ConversationsRouter = require('./chat/conversation')
const ParticipantsRouter = require('./chat/participants');
const SearchRouter = require('./chat/search');
const BlockRouter = require('./blockedUsers');
const ReportRouter = require('./report');

module.exports = (app) => {
    app.use('/api/v1/auth',LoginRouter);
    app.use('/api/v1/auth',RegisterRouter);
    app.use('/api/v1/chat/', [auth] , ContactRouter);
    app.use('/api/v1/chat/',[auth], ConversationsRouter);
    app.use('/api/v1/chat/',ParticipantsRouter);
    app.use('/api/v1/account/',[auth], MyAccountRouter);
    app.use('/api/v1/account/',[auth], BlockRouter)
    app.use('/api/v1/account/', [auth], ReportRouter);
    app.use('/api/v1/chat/',[auth],SearchRouter);
}