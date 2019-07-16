import {
  Injectable,
  EventEmitter
} from '@angular/core';
import {
  Document
} from './document.model';
import {
  Subject
} from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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
      .get<Document[]>('http://localhost:3000/documents')
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

  // storeDocuments() {
  //   const documentsString = JSON.stringify(this.documents);
  //   this.http
  //     .put(
  //       'https://cit-366-cms-ef580.firebaseio.com/documents.json',
  //       documentsString,
  //       { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  //     )
  //     .subscribe(() => {
  //         this.documentListChangedEvent.next(this.documents.slice());
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  // }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    console.log('Removing Document at position ' + pos);
    if (pos < 0) {
      return;
    }

    this.http.delete('http://localhost:3000/documents/' + document.id)
    .subscribe((documents: Document[]) => {
      this.documents = documents;
      this.documentListChangedEvent.next(this.documents.slice());
    });
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    newDocument.id = '';

    this.http.post('http://localhost:3000/documents', newDocument)
    .subscribe((documents: Document[]) => {
      this.documents = documents;
      this.documentListChangedEvent.next(this.documents.slice());
    });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;

    this.http.patch('http://localhost:3000/documents/' + originalDocument.id, newDocument)
    .subscribe((documents: Document[]) => {
      this.documents = documents;
      this.documentListChangedEvent.next(this.documents.slice());
    });
  }

}
