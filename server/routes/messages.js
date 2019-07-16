const express = require('express');
const Message = require('../models/message');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');

function getMessages(res) {

    Message.find()
    .then(messages => {
        return res.status(200).json(messages);
    })
    .catch(error => {
        return res.status(500).json({
            error: error
        });
    });
}

function saveMessage(res, message) {
    message.save().then(() => {
        return getMessages(res);
    })
    .catch(error => {
        return res.status(500).json({
            error: error
        });
    });
}

router.get('/', (req, res, next) => {
    getMessages(res);
});

// function deleteMessage(res, message) {
//     Message.deleteOne({id: message.id})
//     .then(() => {
//         return getMessages();
//     })
//     .catch(error => {
//         return res.status(500).json({
//             error: error
//         });
//     });
// }

// router.get('/', (req, res, next) => {
//     getMessages(res);
// });

router.post('/', (req, res, next) => {
    const maxMessageId = sequenceGenerator.nextId('messages');

    const message = new Message({
        id: maxMessageId,
        subject: req.body.subject,
        msgText: req.body.msgText,
        sender: req.body.sender
    });

    saveMessage(res, message);
});

// router.patch('/:id', (req, res, next) => {
//     Message.findOne({id: req.params.id}, (error, message) => {
//         if(error || !message) {
//             return res.status(500).json({
//                 title: 'No message found!',
//                 error: {message: 'Message not found'}
//             });
//         }
//         message.subject = req.body.subject;
//         message.msgText = req.body.msgText;
//         message.sender = req.body.sender;

//         saveMessage(res, message);
//     });
// });

// router.delete('/:id', (req, res, next) => {
//     Message.findOne({id: req.params.id}, (error, message) => {
//         if(error) {
//             return res.status(500).json({
//                 title: 'No message found',
//                 error: error
//             });
//         }
//         if(!message) {
//             return res.status(500),json({
//                 title: 'No message found!',
//                 error: {messageId: req.params.id}
//             });
//         }

//         deleteMessage(res, message);
//     });
// });

module.exports = router;