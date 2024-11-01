// budget-form.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray, } from '@angular/forms';
import { DateValidator } from '../Validators/date.validator';
import { ServiceService } from '../service.service';
import { ModuleType, Zone, Budget } from '../models/budget';
import { Subscription } from 'rxjs';

interface ModuleFormGroup {
  typeModule: FormControl<string | null>;
  ambient: FormControl<string | null>;
  price: FormControl<string | null>;
  lugares: FormControl<string | null>;
}

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css',
})
export class BudgetFormComponent implements OnInit, OnDestroy {
  moduleTypes: ModuleType[] = [];
  zones = Object.values(Zone);

  constructor(private service: ServiceService) { }

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fecha: new FormControl('', [
      Validators.required,
      DateValidator.greaterThanToday,
    ]),
    modules: new FormArray<FormGroup<ModuleFormGroup>>([], [Validators.required, Validators.minLength(2)]),
  });

  getModulesErrorMessage() {
    const modulesControl = this.userForm.get('modules');
    if (modulesControl?.hasError('required')) {
      return 'Debe añadir al menos un módulo';
    }
    if (modulesControl?.hasError('minlength')) {
      return 'Debe añadir al menos dos módulos';
    }
    return
  }

  createModuleForm(): FormGroup<ModuleFormGroup> {
    return new FormGroup<ModuleFormGroup>({
      typeModule: new FormControl('', [Validators.required]),
      ambient: new FormControl('', [Validators.required]),
      price: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      lugares: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
    });
  }

  get modules(): FormArray<FormGroup<ModuleFormGroup>> {
    return this.userForm.get('modules') as FormArray<
      FormGroup<ModuleFormGroup>
    >;
  }

  addModule(): void {
    this.modules.push(this.createModuleForm());
  }

  deleteModule(index: number): void {
    this.modules.removeAt(index);
  }

  onModuleTypeChange(event: Event, moduleGroup: FormGroup<ModuleFormGroup>) {
    const select = event.target as HTMLSelectElement;
    const selectedModuleType = this.moduleTypes.find(
      (type) => Number(type.id) === Number(select.value),
    );
    if (selectedModuleType) {
      moduleGroup.patchValue({
        price: selectedModuleType.price.toString(),
        lugares: selectedModuleType.slots.toString(),
      });
    }
  }

  getNameErrorMessage() {
    const nombreControl = this.userForm.get('name');
    if (nombreControl?.hasError('required')) {
      return 'Campo requerido';
    }
    if (nombreControl?.hasError('minlength')) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    return '';
  }

  getFechaErrorMessage() {
    const fechaControl = this.userForm.get('fecha');
    if (fechaControl?.hasError('required')) {
      return 'Campo requerido';
    }
    if (fechaControl?.hasError('greaterThanToday')) {
      return 'La fecha no puede ser mayor a la fecha actual';
    }
    return '';
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.getRawValue();
      const budget: Budget = {
        client: formValue.name!,
        date: new Date(formValue.fecha!),
        items: formValue.modules!.map((module) => ({
          zone: module.ambient as Zone,
          moduleType: this.moduleTypes.find(
            (type) => Number(type.id) === Number(module.typeModule)
          )!,
        })),
      };

      const postBudget = this.service.postBudget(budget).subscribe({
        next: (response) => {
          console.log('Presupuesto guardado:', response);
          this.userForm.reset();
          // Reiniciar el FormArray con un módulo inicial
          this.modules.clear();
          this.addModule();
        },
        error: (error) => {
          console.error('Error al guardar el presupuesto:', error);
        },
      });
      this.suscriptions.push(postBudget);
    }
  }

  suscriptions: Subscription[] = [];

  ngOnInit(): void {
    const getModuleTypes = this.service.getModuleTypes().subscribe({
      next: (data) => {
        this.moduleTypes = data;
        // Añadir un módulo inicial después de cargar los tipos
        this.addModule();
      },
      error: (error) => {
        console.error('Error al obtener los tipos de módulos', error);
      },
    });
    this.suscriptions.push(getModuleTypes);
  }

  ngOnDestroy() {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }
}
