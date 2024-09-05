import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent() {
      return import('./components/home/home.component').then(
        (m) => m.HomeComponent
      );
    },
  },

  {
    path: 'insert-update-page/:id',
    loadComponent() {
      return import(
        './components/inset-update-page/inset-update-page.component'
      ).then((m) => m.InsetUpdatePageComponent);
    },
  },

  {
    path: 'register',
    loadComponent() {
      return import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      );
    },
  },
];
