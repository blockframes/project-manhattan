import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WaterfallService } from './+state';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WaterfallGuard implements CanActivate {

  constructor(private service: WaterfallService, private router: Router) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable< UrlTree> {
    const { movieId } = next.params;
    // If we are already inside let go
    if (state.url.split('/').pop() !== 'waterfall') {
      return true;
    }
    // Else redirect to the right page
    return this.service.queryScenario(movieId).pipe(
      map(waterfalls => {
        return waterfalls.length
        ? this.router.parseUrl(`${state.url}/${waterfalls[0].id}`)
        : this.router.parseUrl(`${state.url}/create`);
      })
    );
  }
  
}
