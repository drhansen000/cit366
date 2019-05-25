import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [
    new Document("CIT 260", "CIT 260 - Object Oriented Programming", "This course is an introduction to object oriented programming using the Java programming language. Students will write computer programs using primitive data types, control structures, Java Swing classes, and objects. Students will read and draw UML class diagrams and will use Java swing to write programs with a graphical user interface.", "https://byui.instructure.com/courses/45018/modules/items/5176902", null),
    new Document("CIT 366", "CIT 366 - Full Stack Web Development", "This course will teach you how to design and build interactive web based applications using HTML, CSS, JavaScript, and a web development stack.", "https://www.byui.edu/catalog#/courses/VJkxTr9Ab?bc=true&bcCurrent=Full%20Web%20Stack%20Development&bcItemType=Courses", null),
    new Document("CIT 425", "CIT 425 - Data Warehousing", "This course defines the theory and practice of data analysis.  The course will compare and contrast the operational and analytical database models.  Students will learn how to define, implement, and query a database warehouse by leveraging sample data warehouses built from Enterprise Resource Planning (ERP) and Customer Resource Management (CRM) solutions.", "https://www.byui.edu/catalog#/courses/Ek1Cix2jW?bc=true&bcCurrent=Data%20Warehousing&bcItemType=Courses", null),
    new Document("CIT 460", "CIT 460 - Enterprise Development", "This course covers the architecture for N-tier applications by focusing on the use of effective design patterns. Different technologies to implement the MVC control pattern will be explored. The J2EE architecture will be covered in depth including Servlets, Java Server Pages, and Enterprise Java Beans. Applications that implement all parts of the MVC pattern will be designed, implemented, and deployed.", "https://www.byui.edu/catalog#/courses/Nkly0slhjZ?bc=true&bcCurrent=Enterprise%20Development&bcItemType=Courses", null),
    new Document("CIT 495", "CIT 495 - Senior Practicum", "This is a capstone experience for the Computer Information Technology major.  There are two options available:  A research paper on a relevant Information Technology topic or participate in service learning.  The purpose of this course is to build on the knowledge that students have learned in the Computer Information Technology major.", "https://www.byui.edu/catalog#/courses/EkzCog3sW?bc=true&bcCurrent=Senior%20Practicum&bcItemType=Courses", null),];
  constructor(private documentService: DocumentService) { }

  ngOnInit() {
  }

  onSelectedDocument(document: Document) {
    this.documentService.documentSelectedEvent.emit(document);
  }

}
