import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ContactService } from 'src/app/contacts/contact.service';
import { Contact } from 'src/app/contacts/contact.model';
import { Message } from '../../message.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender = '';

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    const contact: Contact = this.contactService.getContact(this.message.sender);
    if (contact) {
      this.messageSender = contact.name;
    }
  }

}
