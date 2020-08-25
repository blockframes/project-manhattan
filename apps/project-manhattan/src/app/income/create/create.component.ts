import { Component, OnInit } from '@angular/core';
import { IncomeService } from '../+state';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor(private service: IncomeService) { }

  ngOnInit(): void {
  }

}
