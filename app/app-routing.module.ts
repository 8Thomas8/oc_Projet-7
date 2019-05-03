import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { AddCommentComponent } from './components/comment/add-comment/add-comment.component';

import { AuthGuard } from './auth/auth.guard';

const routes : Routes = [
  { path: '', component: RestaurantComponent},
  { path: 'login', loadChildren: './components/login/login.module#LoginModule' },
  { path: 'add-comment', component: AddCommentComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
