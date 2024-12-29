import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SetupService } from '../setup/setup.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SetupCompletedGuard implements CanActivate {

  constructor(
    private setupService: SetupService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (!isPlatformBrowser(this.platformId)) {
          return true;
        }
    return this.setupService.getSetupStatus().pipe(
      map(status => {
        if (status.setup_completed) {
          this.router.navigate(['/blogs']);
          return false;
        }
        return true;
      })
    );
  }
}
