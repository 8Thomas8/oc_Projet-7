// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
//Components
import { LoginComponent } from './../../components/login/login.component';
//Services
import { StorageService } from './../../services/storage.service';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule ,
    FormsModule,
    LoginRoutingModule
  ],
  providers: [
    StorageService
  ]
})
export class LoginModule { }
