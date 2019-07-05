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
  private maxContactId: number;
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
      .get<Contact[]>('https://cit-366-cms-ef580.firebaseio.com/contacts.json')
      .subscribe(contacts => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.contacts = this.contacts.sort((currentContact, nextContact) => {
          return currentContact.name.localeCompare(nextContact.name);
        });
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

  storeContacts() {
    const contactsString = JSON.stringify(this.contacts);
    this.http
      .put(
        'https://cit-366-cms-ef580.firebaseio.com/contacts.json',
        contactsString,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      )
      .subscribe(() => {
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error => {
          console.log(error);
        }
      );
  }

  deleteContact(contact: Contact) {
    if (contact === null || contact === undefined) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    this.storeContacts();
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
    const pos = ++this.maxContactId;
    newContact.id = pos.toString();
    this.contacts.push(newContact);
    this.storeContacts();
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
    this.contacts[pos] = newContact;
    this.storeContacts();
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
}
