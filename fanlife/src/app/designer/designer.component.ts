import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit {

  auth: AngularFireAuth;

  constructor(private fireauth: AngularFireAuth) 
  {
    this.auth = fireauth;
  }

  ngOnInit(): void {
  }

}
