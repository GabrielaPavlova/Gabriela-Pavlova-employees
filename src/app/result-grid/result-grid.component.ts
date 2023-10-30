import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-result-grid',
  templateUrl: './result-grid.component.html',
  styleUrls: ['./result-grid.component.css'],
})
export class ResultGridComponent {
  @Input() data: any[] = [];
  displayedColumns: string[] = ['employee1', 'employee2', 'daysWorked'];
}
