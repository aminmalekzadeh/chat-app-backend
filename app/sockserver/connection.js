const uuidv4 = require('uuid').v4;
const Conversations = require('../db/mongo/models/Conversation');
const Message = require('../db/mongo/models/Message');
const Participants = require('../db/mongo/models/Participants');

const crypto = require('crypto');
const fs = require('fs');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

class Connection {

    constructor(io, socket) {
        this.socket = socket;
        this.io = io;
        this.messages = new Set();
        this.users = new Map();
        this.fileShare = {};
        this.fileShare.buffer = [];
        this.fileShare.transmitted = 0;
        this.fileShare.metadata = null;
        this.urlDirectory = `${process.env.APP_URL}:${process.env.APP_PORT}/static/srv/uploads/`;

        this.defaultUser = {
            id: 'anon',
            name: 'Anonymous',
        };
        socket.emit('online_users', { socketId: socket.id });
        socket.on('online_users', (value) => this.updateStatusUser(value, 'online'));
        socket.on('base64_file', (value) => this.handleMessage(value, 'image'))
        socket.on('getMessages', () => this.getMessages());
        socket.on('message', (value) => this.handleMessage(value));
        socket.on('disconnect', () => this.disconnect());

        socket.on("file-meta", (value) => this.handleMessage(value, 'application'));
        socket.on("fs-start", function (data) {
            socket.emit("fs-share", 0);
        });
        socket.on("file-raw", (value) => this.handleFileBuffer(value));

        socket.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    }

    async handleFileBuffer(data) {
        const { filename, total_buffer_size } = this.fileShare.metadata.value.metadata;
        this.fileShare.buffer.push(data.buffer);
        this.fileShare.transmitted += data.buffer.byteLength;
        let processNode = Math.trunc(this.fileShare.transmitted / this.fileShare.metadata.value.metadata.total_buffer_size * 100);
        if (this.fileShare.transmitted == total_buffer_size) {
            const fileName = this.fileShare.metadata.fileName;
            const dir = "/public/srv/uploads/";
            this.writeFile(appDir + dir, fileName, this.fileShare.buffer);

        } else {
            this.io.sockets.emit("fs-share", processNode);
        }

    }

    async sendMessage(message, type = 'text') {
        if (type === 'text') {
            this.io.sockets.emit('message', message);
        } else if (type === 'application') {
            this.io.sockets.emit('fs-start', {});
            this.fileShare.metadata.value.msg.message = this.urlDirectory + this.fileShare.metadata.fileName;
            this.fileShare.metadata.value.msg.contentType = this.fileShare.metadata.contentType;
            this.io.sockets.emit('file-meta', this.fileShare.metadata.value.msg);
        } else {
            message.contentType = message.contentType.split('/')[0];
            this.io.sockets.emit('base64_file', message);
        }
    }

    getMessages() {
        this.messages.forEach((message) => {
            this.sendMessage(message);
        });
    }

    async handleMessage(value, type = 'text') {
        this.messages.add(value);
        this.SaveData(value, type);
        if (type === 'image' || 'application') {
            this.sendMessage(value, type);
        } else {
            this.sendMessage(value);
        }

    }

    async SaveData(value, type) {

        let { senderId, conversationId, message, contentType, attachments } = type === 'application' ? value.msg : value;

        contentType = contentType.split('/')[0];
        if (type === 'application') {
            this.fileShare.metadata = {
                value,
                contentType,
                fileName: crypto.randomUUID() + "." + attachments[0].type.split('/').pop()
            };
        }


        const data = { senderId, body: type === 'application' ? this.urlDirectory + this.fileShare.metadata.fileName : message, contentType, attachments };
        const options = { multi: true };
        Message.create(data).then(async (result) => {
            await Conversations.updateOne({
                _id: conversationId
            }, { $push: { messages: result._id } }, options);
        });
    }

    updateStatusUser(data, status, lastActivity = null) {
        if (status !== 'offline') {
            this.users.set(data.id, data);
        }
        Participants.updateOne({
            hash_id: data.hash_id
        }, {
            $set: { status: status, lastActivity }
        }, { multi: true }).then((result, err) => {
        });
    }

    writeFile(filePath, FileName, data) {
        let tmpResult = new Uint8Array();
        try {
            const dirname = filePath;
            const exist = this.isExists(dirname);
            if (!exist) {
                fs.mkdir(dirname, { recursive: true });
            }

            for (var i = 0; i < data.length; i++) {
                tmpResult = this.appendBuffer(tmpResult, data[i]);
            }

            fs.writeFileSync(filePath + FileName, tmpResult);

            this.fileShare.buffer = [];
            this.fileShare.transmitted = 0;
            this.fileShare.metadata = null;
        } catch (err) {
            throw new Error(err);
        }
    }

    async isExists(path) {
        try {
            await fs.access(path);
            return true;
        } catch {
            return false;
        }
    };

    appendBuffer(buffer1, buffer2) {
        let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp;
    };


    disconnect() {
        const data = this.users.get(this.socket.id);
        if(this.users.get(this.socket.id).id !== undefined){
            this.users.delete(this.users.get(this.socket.id).id);
        }
        this.updateStatusUser(data, 'offline',new Date());
    }
}

module.exports = Connection;
