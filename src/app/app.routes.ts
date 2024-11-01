import { Routes } from '@angular/router';
import { BudgetFormComponent } from './budget-form/budget-form.component';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { BudgetViewComponent } from './budget-view/budget-view.component';

export const routes: Routes = [
    {
        path: 'budget-form',  // SANTI
        component: BudgetFormComponent,
        title: 'Nuevo'
    },
    {
        path: 'budget-list', // TOMAS
        component: BudgetListComponent,
        title: 'Lista'
    },
    {
        path: 'budget-view',     // AGUSTIN
        component: BudgetViewComponent,
        title: 'vista'
    }
];
