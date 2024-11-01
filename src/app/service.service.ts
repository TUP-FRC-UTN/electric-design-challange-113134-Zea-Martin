import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Budget, ModuleType } from './models/budget';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private readonly _BASE_URL = 'http://localhost:3000';
  private readonly _URL_MODULE_TYPES = `${this._BASE_URL}/module-types`;
  private readonly _URL_BUDGETS = `${this._BASE_URL}/budgets`;

  id?: string;

  constructor(private http: HttpClient) {}

  getModuleTypes(): Observable<ModuleType[]> {
    return this.http.get<ModuleType[]>(this._URL_MODULE_TYPES);
  }

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this._URL_BUDGETS);
  }

  postBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this._URL_BUDGETS, budget);
  }

  setId(id: string) {
    this.id = id;
  }

  getBugdetById(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this._URL_BUDGETS}/${id}`);
  }
}
