import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Message } from './message.model';
import { ContactService } from '../contacts/contact.service';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private messages: Message[] = [];
  private maxMessageId: number;
  messageListChangedEvent = new EventEmitter<Message[]>();

  constructor(private http: HttpClient, private contactService: ContactService) {
    this.initMessages();
  }

  getMaxId() {
    let maxId = 0;
    this.messages.forEach(message => {
      const currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  initMessages() {
    // If the contacts array isn't yet initialized, wait until it is, then get the messages
    if (!this.contactService.getContactsInitialized()) {
      const subscription = this.contactService.contactListChangedEvent.subscribe(
        () => {
          this.getMessages();
          subscription.unsubscribe();
        }
      );
    } else {
      this.getMessages();
    }
  }

  getMessages() {
    this.http
      .get<Message[]>('https://cit-366-cms-ef580.firebaseio.com/messages.json')
      .subscribe(messages => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messageListChangedEvent.next(this.messages.slice());
      },
        error => {
          console.log(error);
        });
  }

  getMessage(id: string): Message {
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  storeMessages() {
    const messagesString = JSON.stringify(this.messages);
    this.http
      .put(
        'https://cit-366-cms-ef580.firebaseio.com/messages.json',
        messagesString,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      )
      .subscribe(() => {
        this.messageListChangedEvent.next(this.messages.slice());
      },
        error => {
          console.log(error);
        }
      );
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
  }
}
