import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutesRoutingModule } from './routes-routing.module';

import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { Error403Component } from './sessions/403.component';
import { Error404Component } from './sessions/404.component';
import { Error500Component } from './sessions/500.component';
import { EmployeesComponent } from './employees/employees.component';
import { MyProfileComponent } from './my-profile/my-profile.component';

const COMPONENTS: any[] = [
  LoginComponent,
  RegisterComponent,
  Error403Component,
  Error404Component,
  Error500Component,
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, RoutesRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, EmployeesComponent, MyProfileComponent],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class RoutesModule {}
