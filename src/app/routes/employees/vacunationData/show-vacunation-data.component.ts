import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MtxGridColumn } from '@ng-matero/extensions';
import { VacunesService } from '@shared/services/vacunes.service ';

@Component({
  selector: 'app-vacunation-data',
  templateUrl: './show-vacunation-data.component.html',
  styles: [
    `
      .demo-full-width {
        width: 100%;
      }
    `,
  ],
})
export class ShowVacunationDataComponent implements OnInit {
  columns: MtxGridColumn[] = [
    {
      header: 'Tipo vacuna',
      field: 'vacuneType',
      minWidth: 100,
    },
    {
      header: 'Fecha vacuna',
      field: 'vacuneDate',
      minWidth: 100,
    },
    {
      header: 'Número de dosis',
      field: 'dosisNumber',
      minWidth: 100,
    },
  ];

  list: any[] = [];
  showPaginator = true;

  constructor(
    public dialogRef: MatDialogRef<ShowVacunationDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public vacunesService: VacunesService
  ) {}

  ngOnInit() {
    this.vacunesService.getVacunes().subscribe(vacunes => {
      this.list = this.data.records.map((info: any) => {
        return {
          ...info,
          vacuneType: vacunes.find(vacune => info.vacuneType === vacune.value)?.name,
        };
      });
    });
  }
}
