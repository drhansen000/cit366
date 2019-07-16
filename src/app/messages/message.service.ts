import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Message } from './message.model';
import { ContactService } from '../contacts/contact.service';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private messages: Message[] = [];
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
      .get<Message[]>('http://localhost:3000/messages')
      .subscribe(messages => {
        this.messages = messages;
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

  // storeMessages() {
  //   const messagesString = JSON.stringify(this.messages);
  //   this.http
  //     .put(
  //       'http://localhost3000/messages',
  //       messagesString,
  //       { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  //     )
  //     .subscribe(() => {
  //       this.messageListChangedEvent.next(this.messages.slice());
  //     },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  // }

  addMessage(newMessage: Message) {
    this.http.post('http://localhost:3000/messages', newMessage)
    .subscribe((messages: Message[]) => {
      this.messages = messages;
      this.messageListChangedEvent.next(this.messages.slice());
    });
  }
}
