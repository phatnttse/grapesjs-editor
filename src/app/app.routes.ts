import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'grapesjs',
    loadComponent() {
      return import(
        './components/template-insert-update/template-insert-update.component'
      ).then((m) => m.TemplateInsertUpdateComponent);
    },
  },
  {
    path: 'grapesjs/:id',
    loadComponent() {
      return import(
        './components/template-insert-update/template-insert-update.component'
      ).then((m) => m.TemplateInsertUpdateComponent);
    },
  },
];
