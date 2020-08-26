import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Route, PreloadAllModules } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { TranslocoRootModule } from './transloco/transloco-root.module';

const routes: Route[] = [{
  path: '',
  redirectTo: 'movie',
  pathMatch: 'full'
},{
  path: 'movie',
  loadChildren: () => import('./movie/movie.module').then(m => m.MovieModule)
}]

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FlexLayoutModule.withConfig({ssrObserveBreakpoints: ['xs', 'lt-md'] }),
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      paramsInheritanceStrategy: 'always',
      relativeLinkResolution: 'corrected'
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    TranslocoRootModule
  ],
  providers: [{
    provide: SETTINGS,
    useValue: environment.production ? undefined : {
      host: 'localhost:8080',
      ssl: false
    }
  }],
  bootstrap: [AppComponent],
})
export class AppModule { }
