import {Component, OnInit} from '@angular/core';
import { FormBuilder, Validators, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {MatTableDataSource} from "@angular/material/table";
import {Phones} from "./entity/Phones";
import {PhonesVO} from "./entity/PhonesVO";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'finra-proj';
  searchForm: FormGroup;
  tableData;
  phones: any;
  displayColumns: string[] = [ 'phoneNumber'];
  page: number;
  sizeList = [
    {value: '5', viewValue: '5'},
    {value: '10', viewValue: '10'},
    {value: '15', viewValue: '15'}
  ];
  disableFirst: boolean;
  disablePrevious: boolean;
  disableLast: boolean;
  disableNext: boolean;

  pageSize: String;
  lastPage: number;
  showResults: boolean;

  private requestUrl: string;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              ) { }

  ngOnInit(): void {
    this.page=0;
    this.showResults=false;
    this.pageSize='5';
    this.searchForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.pattern("^\\d{7}(\\d{3})?$")]],
    });
  }

    // get f() { return this.searchForm.controls; }


  searchPhone() {
    console.log("clicked on search ", this.searchForm.value);
    if (this.searchForm.invalid) {
      console.log('invalid ');
      return;
    }

    this.requestUrl = "http://localhost:8080/generate/"+this.searchForm.value.phoneNumber+"/"+this.page+"/"+this.pageSize;
    console.log('requestUrl ', this.requestUrl);
     this.http.get<PhonesVO>(this.requestUrl).subscribe( data => {
       console.log("data ", data);
       this.phones = <Phones[]>data.phones;
       this.lastPage = data.lastPageNumber;
       console.log("phones ", this.phones);
       this.showResults=true;
        this.tableData = new MatTableDataSource(this.phones);
        console.log('matdata ',this.tableData);
        // this.tableData = new MatTableDataSource<Object>(this.phones);
    });
     this.validateLinks();

  }

  getNextPage() {

  }


  getPage(message: string) {
    console.log(message, ' Message ');

    if(message == 'previous') {
      this.page = this.page - 1;
    }
    if(message == 'next') {
      this.page = this.page + 1;
    }
    if(message == 'first') {
      this.page = 0;
    }
    if(message == 'last') {
      this.disableLast = true;
      this.page = this.lastPage;

    }
    this.searchPhone();
  }

  pageSizeChanged() {
    this.searchPhone();
  }

  validateLinks() {
    console.log('page ', this.page, ' last page ', this.lastPage);
    if(this.page == this.lastPage) {
      console.log('last page ')
      this.disableLast = true;
      this.disableNext = true;
      this.disableFirst = false;
      this.disablePrevious = false;
    }
    else if(this.page == 0) {
      this.disableFirst = true;
      this.disablePrevious = true;
      this.disableLast = false;
      this.disableNext = false;
    }
    else {
      this.disableFirst = false;
      this.disablePrevious = false;
      this.disableLast = false;
      this.disableNext = false;
    }
  }
}
