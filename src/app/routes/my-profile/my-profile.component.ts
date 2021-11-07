import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@core/authentication/auth.service';
import { Employee, EmployeesService, VacunationData } from '@shared/services/employees.service';
import { VacunesService } from '@shared/services/vacunes.service ';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  providers: [EmployeesService, VacunesService],
})
export class MyProfileComponent implements OnInit {
  user!: Employee;
  showData = false;
  form: FormGroup;
  vacunationData: FormArray;
  vacunes: any[] = [];
  maxDate = new Date();

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private employeesService: EmployeesService,
    private vacunesService: VacunesService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.formBuilder.group({
      birthday: [new Date(), Validators.required],
      address: ['', Validators.required],
      telephone: ['', Validators.required],
      vacunationState: ['N', Validators.required],
      VacunationData: this.formBuilder.array([]),
    });
    this.vacunationData = this.form.get('VacunationData') as FormArray;
  }

  ngOnInit(): void {
    this.auth.user().subscribe(user => (this.user = user));
    this.vacunesService.getVacunes().subscribe(vacunes => {
      this.vacunes = vacunes;
    });
  }

  mostrarDatos = () => {
    if (this.showData === false) {
      this.employeesService.getEmployee(this.user.id).subscribe((employee: Employee) => {
        this.form.get('address')?.setValue(employee.address);
        this.form
          .get('birthday')
          ?.setValue(employee.birthday ? new Date(employee.birthday) : new Date());
        this.form.get('telephone')?.setValue(employee.telephone);
        this.form.get('vacunationState')?.setValue(employee.vacunationState);
        employee.VacunationData?.forEach(element => {
          this.addVacunationData(element);
        });
        this.showData = true;
      });
    }
  };

  createVacunationData(v?: VacunationData): FormGroup {
    return this.formBuilder.group({
      id: v?.id ? v.id : '',
      vacuneType: [v?.vacuneType ? v.vacuneType : 'spu', Validators.required],
      vacuneDate: [v?.vacuneDate ? new Date(v.vacuneDate) : new Date(), Validators.required],
      dosisNumber: [v?.dosisNumber ? v.dosisNumber : 1, Validators.required],
    });
  }

  addVacunationData(data: any) {
    if (data) {
      this.vacunationData.push(this.createVacunationData(data));
    } else {
      this.vacunationData.push(this.createVacunationData());
    }
  }

  get VacunationData() {
    return this.form.get('VacunationData') as FormArray;
  }

  deleteVacuneData(i: number) {
    const vacunationDataArray = this.form.get('VacunationData') as FormArray;
    vacunationDataArray.removeAt(i);
  }

  save = () => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.employeesService.getEmployee(this.user.id).subscribe((employee: Employee) => {
      let vacunationData: any = this.VacunationData;

      if (this.form.value.vacunationState === 'N') {
        vacunationData = [];
      } else {
        vacunationData = vacunationData.controls.map((x: any) => {
          return {
            ...x.value,
            id: x.value.id ? x.value.id : new Date().valueOf(),
            vacuneDate: x.value.vacuneDate?._isAMomentObject
              ? x.value.vacuneDate.toDate().toLocaleDateString('en-US')
              : x.value.vacuneDate.toLocaleDateString('en-US'),
          };
        });
      }

      employee = {
        ...employee,
        ...this.form.value,
        birthday: this.form.value.birthday?._isAMomentObject
          ? this.form.value.birthday.toDate().toLocaleDateString('en-US')
          : this.form.value.birthday.toLocaleDateString('en-US'),
        VacunationData: vacunationData,
      };
      this.employeesService.updateEmployee(this.user.id, employee).subscribe((result: any) => {
        this.snackBar.open('Datos Actualizados', 'Cerrar', { duration: 5000 });
      });
    });
  };
}
