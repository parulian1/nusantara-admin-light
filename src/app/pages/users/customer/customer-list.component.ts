import { Component, OnInit } from '@angular/core';
import { UserService } from '@nusantara/services';


@Component({
  selector: 'nus-customer-list',
  template: `
    <h1>Customers</h1>
    <table>
      <tbody>
        <tr *ngFor="let entity of entities">
          <td><a [routerLink]="[entity|entityToSlug]">---</a></td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [``]
})
export class CustomerListComponent implements OnInit {
  public entities: Array<any> = [];
  constructor(private service: UserService) { }
  hrefToEmail(href) { }
  ngOnInit(): void { }
}
