import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ListColumn } from '@fury/shared/list/list-column.model';
import { HttpServiceService } from 'app/http-service/http-service.service';

@Component({
  selector: 'fds-comm-address-query',
  templateUrl: './fds-comm-address-query.component.html',
  styleUrls: ['./fds-comm-address-query.component.scss']
})
export class FdsCommAddressQueryComponent implements OnInit {

  form1: FormGroup;
  resultsLength: number;
  dataSource = new MatTableDataSource<any>();
  columns: ListColumn[] = [
    { name: '地址', property: 'commAdd3', visible: true, isModelProperty: true }
  ] as ListColumn[];
  constructor(private fb: FormBuilder, private httpService: HttpServiceService) { }

  ngOnInit() {
    this.form1 = this.fb.group({
      comm_name: ['', [Validators.maxLength(40)]],
    });
  }

  get visibleColumns() {
    const ans = this.columns
      .filter(column => column.visible)
      .map(column => column.property);
    ans.unshift('management');
    return ans;
  }

}
