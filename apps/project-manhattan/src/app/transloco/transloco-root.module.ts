import { Injectable, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule
} from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(`${environment.baseUrl}/assets/i18n/${lang}.json`);
  }
}



const formatting = {
  currency: {
    minimumFractionDigits: 0
  },
  decimal: {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }
};

@NgModule({
  imports: [
    TranslocoLocaleModule.init({
      defaultLocale: 'fr-FR',
      localeConfig: {
        global: formatting
      },
      langToLocaleMapping: {
        fr: 'fr-FR'
      }
    })
  ],
  exports: [ TranslocoModule ],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['fr'],
        defaultLang: 'fr',
        fallbackLang: 'fr',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: false,
        prodMode: environment.production,
        flatten: {
          aot: environment.production
        }
      })
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader }
  ]
})
export class TranslocoRootModule {}
