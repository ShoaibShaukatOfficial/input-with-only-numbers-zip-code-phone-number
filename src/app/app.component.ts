import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name = 'Angular 6';
  
  myForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.myForm = this.fb.group({
      postalCode: [null, Validators.required]
    });
  }

}
