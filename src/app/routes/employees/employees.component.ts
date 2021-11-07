import { Component, OnInit } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MtxGridColumn } from '@ng-matero/extensions';

import { Employee, EmployeesService } from '@shared/services/employees.service';
import { ShowVacunationDataComponent } from './vacunationData/show-vacunation-data.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VacunesService } from '@shared/services/vacunes.service ';
import { EmployeesEditComponent } from './employeesEdit/employees-edit.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  providers: [EmployeesService],
})
export class EmployeesComponent implements OnInit {
  vacunationStates = {
    V: 'VACUNADO',
    N: 'NO VACUNADO',
  };

  columns: MtxGridColumn[] = [
    {
      header: 'Cedula',
      field: 'identification',
      minWidth: 100,
    },
    {
      header: 'Nombre',
      field: 'name',
      minWidth: 100,
    },
    {
      header: 'Apellido',
      field: 'lastName',
      minWidth: 100,
    },
    {
      header: 'Correo',
      field: 'email',
      minWidth: 100,
    },
    {
      header: 'Fecha Nacimiento',
      field: 'birthday',
      minWidth: 100,
    },
    {
      header: 'Dirección',
      field: 'address',
      minWidth: 120,
    },
    {
      header: 'Telefono',
      field: 'telephone',
      minWidth: 120,
      width: '120px',
    },
    {
      header: 'Estado Vacunacion',
      field: 'vacunationState',
      minWidth: 180,
    },
    {
      header: 'Usuario',
      field: 'username',
      minWidth: 180,
    },
    {
      header: 'Rol',
      field: 'role',
      minWidth: 180,
    },
    {
      header: 'Operaciones',
      field: 'operation',
      minWidth: 120,
      width: '120px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'Editar',
          click: record => this.edit(record),
        },
        {
          type: 'icon',
          icon: 'local_hospital',
          tooltip: 'Datos vacunacion',
          click: record => this.viewVacunationData(record),
        },
        {
          color: 'warn',
          icon: 'delete',
          text: 'Eliminar',
          tooltip: 'Eliminar',
          pop: true,
          popTitle: '¿Desea eliminar?',
          popCloseText: 'Cerrar',
          popOkText: 'Ok',
          click: record => this.delete(record),
        },
      ],
    },
  ];
  list: any[] = [];
  isLoading = true;
  form: FormGroup;

  showPaginator = true;
  expandable = false;
  vacunes: any[] = [];

  constructor(
    private employeesService: EmployeesService,
    public dialog: MtxDialog,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public vacunesService: VacunesService
  ) {
    this.form = this.formBuilder.group({
      vacunationState: [],
      vacuneType: [],
      dateFrom: [],
      dateTo: [],
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.form.get('dateFrom')?.setValue(new Date());
    this.form.get('dateTo')?.setValue(new Date());
    this.form.get('vacunationState')?.setValue('V');
    this.employeesService.getEmployees().subscribe((result: Employee[]) => {
      this.list = result.map((x: Employee) => {
        return { ...x, vacunationState: this.vacunationStates[x.vacunationState] };
      });
    });
    this.vacunesService.getVacunes().subscribe(vacunes => {
      this.vacunes = vacunes;
      this.vacunes.unshift({
        name: 'TODAS',
        value: 'T',
      });
      this.form.get('vacuneType')?.setValue(this.vacunes[0].value);
      this.isLoading = false;
    });
  }

  edit(value: any) {
    const dialogRef = this.dialog.originalOpen(EmployeesEditComponent, {
      width: '600px',
      data: { record: value },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  delete(value: any) {
    this.employeesService.deleteEmployee(value.id).subscribe(() => {
      this.dialog.alert(`Registro eliminado`);
      this.ngOnInit();
    });
  }

  new() {
    const dialogRef = this.dialog.originalOpen(EmployeesEditComponent, {
      width: '600px',
      data: { record: null },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  viewVacunationData(value: any) {
    if (value.VacunationData.length > 0) {
      this.dialog.originalOpen(ShowVacunationDataComponent, {
        width: '600px',
        data: { records: value.VacunationData },
      });
    } else {
      this.snackBar.open('No posee registros de vacunación', 'Cerrar', { duration: 5000 });
    }
  }

  enableRowExpandable() {
    this.columns[0].showExpand = this.expandable;
  }

  search = () => {
    this.isLoading = true;

    this.employeesService.getEmployees().subscribe((result: Employee[]) => {
      this.list = result.filter(
        (x: Employee) => x.vacunationState === this.form.get('vacunationState')?.value
      );

      if (this.form.get('vacunationState')?.value === 'N') {
        this.list = this.list.map((x: Employee) => {
          return { ...x, vacunationState: this.vacunationStates[x.vacunationState] };
        });
        this.isLoading = false;
        return;
      } else {
        if (this.form.get('vacuneType')?.value !== 'T') {
          this.list = this.list.filter((x: any) => {
            return x.VacunationData.find(
              (elementTypeVacune: any) =>
                elementTypeVacune.vacuneType === this.form.get('vacuneType')?.value
            );
          });
        }

        this.list = this.list.filter((x: any) => {
          return x.VacunationData.find((elementDateVacune: any) => {
            const vacuneDate = new Date(elementDateVacune.vacuneDate).getTime();
            const dateStart = this.form.get('dateFrom')?.value._isAMomentObject
              ? this.form.get('dateFrom')?.value.toDate().getTime()
              : this.form.get('dateFrom')?.value.getTime();
            const dateEnd = this.form.get('dateTo')?.value._isAMomentObject
              ? this.form.get('dateTo')?.value.toDate().getTime()
              : this.form.get('dateTo')?.value.getTime();
            return vacuneDate >= dateStart && vacuneDate <= dateEnd;
          });
        });

        this.list = this.list.map((x: Employee) => {
          return { ...x, vacunationState: this.vacunationStates[x.vacunationState] };
        });
        this.isLoading = false;
      }
    });
  };

  clean = () => {
    this.ngOnInit();
  };
}
