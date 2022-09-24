import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';
  formId = "offlineExamAdd";
  form!: FormGroup;
  nominees!: FormArray;
  nomineeData! : any;
  customerDateOfBirth : Boolean = false;
  nomineedatavalidate : Boolean = false;
  genders: any = [
    {value: 'Male', viewValue: 'Male'},
    {value: 'Female', viewValue: 'Female'},
    {value: 'Other', viewValue: 'Other'},
  ];
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
   private appService : AppService
  ) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ["", [Validators.required , Validators.maxLength(35), Validators.minLength(3)]],
      dob: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      value1: ["",],
      value2: ["",],
      value3: ["",],
      nominees: this.fb.array([]),
    });
   
  }

  addCustomer(value : any) {
    let dataForsave = {
      "name" : value.name,
      "dob" : value.dob,
      "gender" : value.gender,
      "nominees" : value.nominees

    }
    this.appService.create(dataForsave)
    .subscribe({
      next: (res) => {

        this.toastr.success('customer added successfully');
       
      },
      error: (e) => 
      {

        this.toastr.error('customer not added');
      }
    });
  }

  NomineesItem(v1: any,v2: any,v3: any) {
    return this.fb.group({
      name: [v1, [Validators.required,]],
      dob: [v2, [Validators.required,]],
      gender: [v3, [Validators.required,]],
    })
  }

  addItem() {
    this.nominees = this.form.get('nominees') as FormArray;
    let v1  = this.form.get('value1')!.value;
    let v2 = this.form.get('value2')!.value;
    let v3 = this.form.get('value3')!.value;
    
    if(v1=='' || v2 == '' || v3 == ''){
      this.toastr.warning('All fields are required for adding a nominee');
    }
    else {
      this.nominees.push(this.NomineesItem(v1,v2,v3));
      
      this.nomineeData = this.form.value.nominees;
     

      if (this.nomineeData.length === 3) {
        this.nomineedatavalidate = true;
        this.toastr.warning('Maximum 3 nominees can be added');

      }

      this.form.get('value1')!.reset();
      this.form.get('value2')!.reset();
      this.form.get('value3')!.reset();
    }
  }

  removeNominee(loadIndex: number) {
    this.nominees.removeAt(loadIndex);
    this.nomineeData = this.form.value.nominees;
    this.nomineedatavalidate = false;
  }

  onChangeDOB (date : any ) {
    let timeDiff = Math.abs(Date.now() - date);
    let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
    if (age < 18) {
      this.customerDateOfBirth = true ;

     
      this.toastr.error('age is below 18');
      
      this.form.get('dob')!.reset();

    } else {
      this.customerDateOfBirth = false ;
    }

  }

  onChangeNomineeDOB (date : any ) {
    let timeDiff = Math.abs(Date.now() - date);
    let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
    if (age < 18) {

      
      this.toastr.error('age is below 18');
      
      this.form.get('value2')!.reset();

    }

  }

 
}
