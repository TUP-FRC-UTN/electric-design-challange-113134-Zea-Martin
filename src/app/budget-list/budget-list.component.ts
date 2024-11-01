import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { Budget } from '../models/budget';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.css',
})
export class BudgetListComponent implements OnInit, OnDestroy {
  /* ADDITIONAL DOCS:
    - https://angular.dev/guide/components/lifecycle#
    - https://angular.dev/guide/http/making-requests#http-observables
    - https://angular.dev/guide/http/setup#providing-httpclient-through-dependency-injection
    - https://angular.dev/guide/http/making-requests#setting-request-headers
    - https://angular.dev/guide/http/making-requests#handling-request-failure
    - https://angular.dev/guide/http/making-requests#best-practices (async pipe)
    - https://angular.dev/guide/testing/components-scenarios#example-17 (async pipe)
  */

  budgets: Budget[] = [];
  suscriptions: Subscription[] = [];
  id?: string = '';

  constructor(private service: ServiceService, private router: Router, private route: ActivatedRoute ) { }

  ngOnDestroy(): void {
    this.suscriptions.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }

  ngOnInit() {
    const getBudgets = this.service.getBudgets().subscribe((budgets) => {
      this.budgets = budgets;
      console.log(this.budgets);
    });
    this.suscriptions.push(getBudgets);

    const route = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    this.suscriptions.push(route);
  }
  
  view(arg0: string|undefined) {
    this.id = arg0;
    this.router.navigate(['/budget', this.id]);
  }
}
