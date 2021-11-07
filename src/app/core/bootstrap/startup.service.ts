import { Injectable } from '@angular/core';
import { iif, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MenuService } from './menu.service';
import { TokenService } from '../authentication/token.service';
import { LoginService } from '../authentication/login.service';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { Employee } from '@shared/services/employees.service';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  user!: Employee;
  constructor(
    private token: TokenService,
    private menu: MenuService,
    private login: LoginService,
    private permissonsSrv: NgxPermissionsService,
    private rolesSrv: NgxRolesService
  ) {}

  /** Load the application only after get the menu or other essential informations such as roles and permissions. */
  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.token
        .changed()
        .pipe(
          switchMap(() => iif(() => this.token.valid(), this.login.menu(), of({ menu: [] }))),
          catchError(error => throwError(error))
        )
        .subscribe((response: any) => {
          this.menu.addNamespace(response.menu, 'menu');
          this.menu.set(response.menu);
          if (response.menu.length > 0) {
            this.login.me().subscribe((x: Employee) => {
              // Demo purposes only. You can add essential permissions and roles with your own cases.

              let permissions = [];

              if (x.role === 'ADMIN') {
                permissions = ['canAdd', 'canDelete', 'canEdit', 'canRead'];
              } else {
                permissions = ['canRead'];
              }

              this.permissonsSrv.loadPermissions(permissions);
              let roleObject: any = {};
              roleObject[x.role] = permissions;
              this.rolesSrv.addRoles(roleObject);
              resolve(null);

              // Tips: Alternative you can add permissions with role at the same time.
              // this.rolesSrv.addRolesWithPermissions({ ADMIN: permissions });
            });
          } else {
            resolve(null);
          }
        });
    });
  }
}
