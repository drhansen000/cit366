import {
  Injectable,
  EventEmitter
} from '@angular/core';
import {
  Subject
} from 'rxjs';

import {
  Contact
} from './contact.model';
import {
  MOCKCONTACTS
} from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  private maxContactId: number;
  contactSelectedEvent = new EventEmitter < Contact > ();
  contactListChangedEvent = new Subject < Contact[] > ();

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  ngOnInit() {}

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
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
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
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  addContact(newContact: Contact) {
    if(newContact === null || newContact === undefined) {
        return;
    }
    const pos = this.maxContactId++;
    newContact.id = pos.toString();
    this.contacts.push(newContact);
    let contactsListClone: Contact[] = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if(originalContact === null || originalContact === undefined || newContact === null || newContact === undefined) {
        return;
    }

    const pos = this.contacts.indexOf(originalContact);
    if(pos < 0) {
        return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    let contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  }
}
