const express = require('express');
const Contact = require('../models/contact');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');

function getContacts(res) {
    Contact.find()
    .populate('group')
    .then(contacts => {
        return res.status(200).json(contacts);
    })
    .catch(error => {
        return res.status(500).json({
            error: error
        });
    });
}

function saveContact(res, contact) {
    if(contact.group && contact.group.length > 0) {
        for(let groupContact of contact.group) {
            groupContact = groupContact._id;
        }
    }
    contact.save().then(() => {
        return getContacts(res);
    })
    .catch(error => {
        return res.status(500).json({
            error: error
        });
    });
}

function deleteContact(res, contact) {
    Contact.deleteOne({id: contact.id})
    .then(() => {
        return getContacts(res);
    })
    .catch(error => {
        return res.status(500).json({
            error: error
        });
    });
}

router.get('/', (req, res, next) => {
    getContacts(res);
});

router.post('/', (req, res, next) => {
    const maxContactId = sequenceGenerator.nextId('contacts');

    const contact = new Contact({
        id: maxContactId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl,
        group: req.body.group
    });

    saveContact(res, contact);
});

router.patch('/:id', (req, res, next) => {
    Contact.findOne({id: req.params.id}, (error, contact) => {
        if(error || !contact) {
            return res.status(500).json({
                title: 'No contact found!',
                error: {contact: 'Contact not found'}
            });
        }
        contact.name = req.body.name;
        contact.email = req.body.email;
        contact.phone = req.body.phone;
        contact.imageUrl = req.body.imageUrl;

        saveContact(res, contact);
    });
});

router.delete('/:id', (req, res, next) => {
    Contact.findOne({id: req.params.id}, (error, contact) => {
        if(error) {
            return res.status(500).json({
                title: 'No contact found',
                error: error
            });
        }
        if(!contact) {
            return res.status(500),json({
                title: 'No contact found!',
                error: {contactId: req.params.id}
            });
        }

        deleteContact(res, contact);
    });
});

module.exports = router;