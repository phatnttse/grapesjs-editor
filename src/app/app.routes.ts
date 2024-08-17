import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'edit-page/:id',
    loadComponent() {
      return import('./components/edit-page/edit-page.component').then(
        (m) => m.EditPageComponent
      );
    },
  },
  {
    path: 'create-page',
    loadComponent() {
      return import('./components/create-page/create-page.component').then(
        (m) => m.CreatePageComponent
      );
    },
  },
];
