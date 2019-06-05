import { Injectable, EventEmitter } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';

@Injectable({providedIn: 'root'})
export class DocumentService {
    private documents: Document[] = [];
    documentSelectedEvent = new EventEmitter<Document>();
    documentsChangedEvent = new EventEmitter<Document[]>();
    
    constructor() {
        this.documents = MOCKDOCUMENTS;
    }

    ngOnInit() {}

    getDocuments(): Document[] {
        return this.documents.slice();
    }

    getDocument(id: string) {
        for(let document of this.documents) {
            if(id === document.id) {
                return document;
            }
        }
        return null;
    }

    deleteDocument(document: Document) {
        if(document === null) {
            return;
        }
        const pos = this.documents.indexOf(document);
        if(pos < 0) {
            return;
        }

        this.documents.splice(pos, 1);
        this.documentsChangedEvent.emit(this.documents.slice());
    }
}