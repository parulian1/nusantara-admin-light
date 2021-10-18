import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {ToastService} from '@nusantara/core';

@Component({
  selector: 'nus-kgx-wms',
  template: `
    <nus-detail-title originalName="WMS KGX" typeName="WMS KGX"></nus-detail-title>

  `,
  styles: [
  ]
})
export class KgxWmsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private toast: ToastService) { }

  ngOnInit(): void {
  }

  initializeForm(entity?) {

  }

}
