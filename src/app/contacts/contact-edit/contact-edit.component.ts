import { Component, OnInit, OnDestroy } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription, TimeoutError } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit, OnDestroy {
  contact: Contact = null;
  groupContacts: Contact[] = [];
  editMode = false;
  hasGroup = false;
  invalidGroupContact: boolean;
  subcription: Subscription;

  constructor(private contactService: ContactService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.subcription = this.route.params.subscribe(
      (params: Params) => {
        const id = params.id;

        if (id === null || id === undefined) {
          this.editMode = false;
          return;
        }

        const originalContact = this.contactService.getContact(id);

        if (originalContact === null || originalContact === undefined) {
          return;
        }

        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(originalContact));

        if (this.contact.group) {
          this.groupContacts = JSON.parse(JSON.stringify(this.contact.group)).slice();
        }
      }
    );
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }

    if (this.editMode) {
      if (newContact.id === this.contact.id) {
        return true;
      }
    }

    for (const contactEl of this.groupContacts) {
      if (newContact.id === contactEl.id) {
        return true;
      }
    }

    return false;
  }

  addToGroup(event: any) {
    const selectedContact = event.dragData;
    this.invalidGroupContact = this.isInvalidContact(selectedContact);

    if (this.invalidGroupContact) {
      return;
    }

    this.groupContacts.push(selectedContact);
    this.invalidGroupContact = false;
  }

  onRemoveItem(idx: number) {
    if (idx < 0 || idx > this.groupContacts.length) {
      return;
    }

    this.groupContacts.splice(idx, 1);
    this.invalidGroupContact = false;
  }

  onSubmit(form: NgForm) {
    const values = form.value;
    const newContact = new Contact(values.contactId, values.name, values.email, values.phone, values.imageUrl, this.groupContacts);

    if (this.editMode) {
      this.contactService.updateContact(this.contact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['/contact']);
  }

  onCancel() {
    this.router.navigate(['/contact']);
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

}
