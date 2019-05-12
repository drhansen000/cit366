import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message("111", "School 1", "first sample text", "Fake Person 1"),
    new Message("222", "School 2", "second sample text", "Fake Person 2"),
    new Message("333", "School 3", "third sample text", "Fake Person 3")];

  onAddMessage(message: Message) {
    this.messages.push(message);
    console.log(message);
  }

  constructor() { }

  ngOnInit() {
  }

}
