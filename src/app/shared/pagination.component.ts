import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'nus-pagination',
    template: `
        <div class="pagination-container">
            <div class="pg-info">
                <p *ngIf="totalItem > 0">
                    Menampilkan <strong>{{startItem}}-{{(endItem)}}</strong> dari <strong>{{totalItem}}</strong> {{label}}
                </p>
            </div>
            <div class="pg-button">
                <button (click)="goBack()"
                        [disabled]="!canGoBack"><i class="ion-ios-arrow-back"></i></button>
                <span>{{currentPage}} / {{maxPages}}</span>
                <button (click)="goNext()"
                        [disabled]="!canGoNext"><i class="ion-ios-arrow-forward"></i></button>
            </div>
        </div>`,
    styles: [
      '.pagination-container { display: flex; justify-content: space-between; }',
      '.pg-info { color: #464646; font-family: \'Karla\', sans-serif; text-align: left; width: 60%; }',
      ]
})

export class PaginationComponent implements OnInit, OnDestroy {

    @Input() maxPages = 1;
    @Input() gtmServiceFn?: any;
    @Input() labeling?: string;
    @Input() totalItem: number;
    @Input() limit = 20;
    public label: string;
    private subscription: Subscription;
    private _currentPage = 1;
    private _start = 1;
    private _end = 20;

    public constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.subscription = this.activatedRoute.queryParams.subscribe(
            params => {
                this._currentPage = params.page || 1;
                this.checkStartEnd();
            }
        );
        this.label = !!this.labeling ? this.labeling : 'Produk';
    }

    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public get currentPage(): number {
        return this._currentPage;
    }

    public set currentPage(value: number) {
        if (value !== this.currentPage) {
            this._currentPage = value;
            if (this.gtmServiceFn) {
                this.gtmServiceFn({
                    value,
                    status: 'pagination'
                });
            }
            this.router.navigate([], {
                queryParams: {
                    page: value
                },
                queryParamsHandling: 'merge'
            });
        }
    }

    public get canGoBack(): boolean {
        return this.currentPage > 1;
    }

    public get canGoNext(): boolean {
        return this.currentPage < this.maxPages;
    }

    public goBack(): void {
        if (this.canGoBack) {
            --this.currentPage;
        }
    }

    public goNext(): void {
        if (this.canGoNext) {
            this.currentPage++;
        }
    }

    public get startItem(): number {
        this.checkStartEnd();
        return this._start;
    }

    public get endItem(): number {
        this.checkStartEnd();
        return this._end;
    }

    public checkStartEnd(): void {
        this._start = ((this.currentPage * this.limit) - this.limit) + 1;
        const _static_end = this.currentPage * this.limit;
        if (_static_end > this.totalItem) {
            this._end = this.totalItem;
        } else {
            this._end = _static_end;
        }
    }

}
