import {
  Injectable,
  EventEmitter,
  OnInit
} from '@angular/core';
import {
  Subject
} from 'rxjs';

import {
  Contact
} from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  private contactsInitialized = false;
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();

  constructor(private http: HttpClient) {
    this.getContacts();
  }

  getMaxId() {
    let maxId = 0;
    this.contacts.forEach(contact => {
      const currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });

    return maxId;
  }

  getContacts(): Contact[] {
    this.http
      .get<Contact[]>('http://localhost:3000/contacts')
      .subscribe(contacts => {
        this.contacts = contacts;
        this.orderContacts();
        this.contactListChangedEvent.next(this.contacts.slice());
        if (!this.contactsInitialized) {
          this.contactsInitialized = true;
        }
      },
        error => {
          console.log(error);
        });
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  // storeContacts() {
  //   const contactsString = JSON.stringify(this.contacts);
  //   this.http
  //     .put(
  //       'https://cit-366-cms-ef580.firebaseio.com/contacts.json',
  //       contactsString,
  //       { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  //     )
  //     .subscribe(() => {
  //         this.contactListChangedEvent.next(this.contacts.slice());
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  // }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts = this.contacts.sort((currentContact, nextContact) => {
      return currentContact.name.localeCompare(nextContact.name);
    });
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
    .subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
      this.orderContacts();
      this.contactListChangedEvent.next(this.contacts.slice());
    });
  }

  addContact(newContact: Contact) {
    if (newContact === null || newContact === undefined) {
      return;
    }

    if (newContact.imageUrl === undefined) {
      newContact.imageUrl = '';
    }

    if (newContact.phone === undefined) {
      newContact.phone = '';
    }
    newContact.id = '';
    this.http.post('http://localhost:3000/contacts', newContact)
    .subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
      this.orderContacts();
      this.contactListChangedEvent.next(this.contacts.slice());
    });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (originalContact === null || originalContact === undefined || newContact === null || newContact === undefined) {
      return;
    }

    const pos = this.findContact(originalContact.id);
    if (pos < 0) {
      return;
    }


    newContact.id = originalContact.id;
    this.http.patch('http://localhost:3000/contacts/' + originalContact.id, newContact)
    .subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
      this.orderContacts();
      this.contactListChangedEvent.next(this.contacts.slice());
    });
  }

  findContact(id: string): number {
    for (let i = 0; i < this.contacts.length; i++) {
      if (this.contacts[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  getContactsInitialized(): boolean {
    return this.contactsInitialized;
  }

  orderContacts() {
    this.contacts = this.contacts.sort((currentContact, nextContact) => {
      return currentContact.name.localeCompare(nextContact.name);
    });
  }
}
