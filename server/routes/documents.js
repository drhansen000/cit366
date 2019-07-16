const express = require('express');
const Document = require('../models/document');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');

function getDocuments(res) {
    Document.find()
    .then(documents => {
        return res.status(200).json(documents);
    })
    .catch(error => {
        return res.status(500).json({
            error: error
        });
    });
}

function saveDocument(res, document) {
    document.save().then(() => {
        return getDocuments(res);
    })
    .catch(error => {
        console.log('Save had an error:' + error);
        return res.status(500).json({
            error: error
        });
    });
}

function deleteDocument(res, document) {
    Document.deleteOne({id: document.id})
    .then(() => {
        return getDocuments(res);
    })
    .catch(error => {
        return res.status(500).json({
            error: error
        });
    });
}

router.get('/', (req, res, next) => {
    getDocuments(res);
});

router.post('/', (req, res, next) => {
    const maxDocumentId = sequenceGenerator.nextId('documents');

    const document = new Document({
        id: maxDocumentId,
        name: req.body.name,
        description: req.body.description,
        url: req.body.url
    });

    saveDocument(res, document);
});

router.patch('/:id', (req, res, next) => {
    Document.findOne({id: req.params.id}, (error, document) => {

        if(error || !document) {
            return res.status(500).json({
                title: 'No document found!',
                error: {document: 'Document not found'}
            });
        }

        document.name = req.body.name;
        document.description = req.body.description;
        document.url = req.body.url;
        saveDocument(res, document);
    });
});

router.delete('/:id', (req, res, next) => {
    Document.findOne({id: req.params.id}, (error, document) => {
        if(error) {
            return res.status(500).json({
                title: 'No document found',
                error: error
            });
        }
        if(!document) {
            return res.status(500),json({
                title: 'No document found!',
                error: {documentId: req.params.id}
            });
        }

        deleteDocument(res, document);
    });
});

module.exports = router;