import { Pipe, PipeTransform } from '@angular/core';

import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter'
})
export class ContactsFilterPipe implements PipeTransform {

  transform(contacts: any, term): any {
    if (term === undefined || term < 1) {
      return contacts;
    }

    const filteredContacts: Contact[] = [];

    for (const contact of contacts) {
      if (contact.name.toLowerCase().includes(term.toLowerCase())) {
        filteredContacts.push(contact);
      }
    }

    if (filteredContacts.length < 1) {
      return contacts;
    }

    return filteredContacts;
  }

}
