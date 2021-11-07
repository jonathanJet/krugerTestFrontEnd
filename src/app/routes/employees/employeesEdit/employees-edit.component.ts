import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IdentificacionValidator } from '@shared/controls/validatorControls';
import { Employee, EmployeesService } from '@shared/services/employees.service';

@Component({
  selector: 'app-employees-edit',
  templateUrl: './employees-edit.component.html',
  styles: [
    `
      .demo-full-width {
        width: 100%;
      }
    `,
  ],
  providers: [EmployeesService],
})
export class EmployeesEditComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EmployeesEditComponent>,
    private formBuilder: FormBuilder,
    private employeesService: EmployeesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
      id: '',
      identification: new FormControl('', [Validators.required, IdentificacionValidator]),
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('EMPLEADO', [Validators.required]),
      birthday: [''],
      address: [''],
      telephone: [''],
      vacunationState: ['N'],
      username: '',
      password: '',
      VacunationData: [],
    });
  }

  ngOnInit() {
    if (this.data.record) {
      this.employeesService.getEmployee(this.data.record.id).subscribe((x: Employee) => {
        this.form.setValue(x);
      });
    }
  }

  Save = () => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let employee: Employee = {
      ...this.form.value,
    };

    if (this.data.record) {
      this.employeesService.updateEmployee(employee.id, employee).subscribe((result: any) => {
        this.dialogRef.close(true);
      });
    } else {
      employee = {
        ...employee,
        id: new Date().valueOf(),
        username: this.form.value.email,
        password: this.form.value.identification,
        VacunationData: [],
      };
      this.employeesService.saveEmployee(employee).subscribe((result: any) => {
        this.dialogRef.close(true);
      });
    }
  };

  onClose(): void {
    this.dialogRef.close(false);
  }
}
