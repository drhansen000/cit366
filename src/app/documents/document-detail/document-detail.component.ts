import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from 'src/app/wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  document: Document;
  nativeWindow: any;
  
  constructor(private documentServce: DocumentService, 
              private router: Router, 
              private route: ActivatedRoute, 
              private windowRefService: WindRefService) { 
    this.nativeWindow = this.windowRefService.getNativeWindow();
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.document = this.documentServce.getDocument(params['id']);
      }
    );
  }

  onView() {
    if(this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    this.documentServce.deleteDocument(this.document);
    this.router.navigate(["/documents"]);
  }

}
