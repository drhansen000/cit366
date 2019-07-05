import {
  Injectable,
  EventEmitter,
  OnInit
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
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  private maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.getDocuments();
  }

  getMaxId(): number {
    let maxId = 0;
    this.documents.forEach(document => {
      const currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  getDocuments() {
    this.http
      .get<Document[]>('https://cit-366-cms-ef580.firebaseio.com/documents.json')
      .subscribe(documents => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents = this.documents.sort((currentDocument, nextDocument) => {
          return currentDocument.name.localeCompare(nextDocument.name);
        });
        this.documentListChangedEvent.next(this.documents.slice());
      },
        error => {
          console.log(error);
        });
  }

  getDocument(id: string) {
    for (const document of this.documents) {
      if (id === document.id) {
        return document;
      }
    }
    return null;
  }

  storeDocuments() {
    const documentsString = JSON.stringify(this.documents);
    this.http
      .put(
        'https://cit-366-cms-ef580.firebaseio.com/documents.json',
        documentsString,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      )
      .subscribe(() => {
          this.documentListChangedEvent.next(this.documents.slice());
        },
        error => {
          console.log(error);
        }
      );
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
    this.storeDocuments();
  }

  addDocument(newDocument: Document) {
    if (document === null || document === undefined) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument === null || originalDocument === undefined || newDocument === null || newDocument === undefined) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

}
