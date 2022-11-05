import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { initializeApp } from "firebase/app";

import firebaseConfig from 'firebase-config.json' assert {type: 'json'};

const app = initializeApp(firebaseConfig);

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
