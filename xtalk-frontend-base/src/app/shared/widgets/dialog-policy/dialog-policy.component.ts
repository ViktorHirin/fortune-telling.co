import { Component, OnInit,Inject } from '@angular/core';
import { DialogPolicyData} from '@/_models/Interface/IDialogPolicyData';
import {MatDialog,MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-policy',
  templateUrl: './dialog-policy.component.html',
  styleUrls: ['./dialog-policy.component.css']
})
export class DialogPolicyComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogPolicyData) {}

  ngOnInit() {
  }

}


