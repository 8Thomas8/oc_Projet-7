import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      //If something in sessionStorage, user is logged
      if (sessionStorage['user']) {
         return true;
      } else {
      //If user is not logged, naviguate to route /login
        this.router.navigate(['login']);
        alert("Connectez-vous pour accèder à cette page");
      }
  }
}
