import {
  Injectable,
  EventEmitter
} from '@angular/core';
import {
  MOCKDOCUMENTS
} from './MOCKDOCUMENTS';
import {
  Document
} from './document.model';
import {
  Subject
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  documentSelectedEvent = new EventEmitter < Document > ();
  documentListChangedEvent = new Subject < Document[] > ();
  private maxDocumentId: number;

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  ngOnInit() {}

  getMaxId(): number {
    let maxId: number = 0;
    this.documents.forEach(document => {
      const currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string) {
    for (let document of this.documents) {
      if (id === document.id) {
        return document;
      }
    }
    return null;
  }

  deleteDocument(document: Document) {
    if (document === null || document === undefined) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);
    this.documentListChangedEvent.next(this.documents.slice());
  }

  addDocument(newDocument: Document) {
    if(document === null || document === undefined) {
        return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    let documentsListClone: Document[] = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if(originalDocument === null || originalDocument === undefined || newDocument === null || newDocument === undefined) {
        return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if(pos < 0) {
        return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    let documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

}
