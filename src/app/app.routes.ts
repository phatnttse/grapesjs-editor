import { NameCardInsertUpdateComponent } from './components/name-card-insert-update/name-card-insert-update.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'templates',
    loadComponent() {
      return import('./components/templates/templates.component').then(
        (m) => m.TemplatesComponent
      );
    },
  },
  {
    path: 'template',
    loadComponent() {
      return import(
        './components/template-insert-update/template-insert-update.component'
      ).then((m) => m.TemplateInsertUpdateComponent);
    },
  },
  {
    path: 'template/:id',
    loadComponent() {
      return import(
        './components/template-insert-update/template-insert-update.component'
      ).then((m) => m.TemplateInsertUpdateComponent);
    },
  },

  {
    path: 'name-card',
    loadComponent() {
      return import(
        './components/name-card-insert-update/name-card-insert-update.component'
      ).then((m) => m.NameCardInsertUpdateComponent);
    },
    children: [
      {
        path: 'register',
        loadComponent() {
          return import(
            './components/name-card-insert-update/name-card-insert-update.component'
          ).then((m) => m.NameCardInsertUpdateComponent);
        },
      },
    ],
  },
  {
    path: 'name-card/:slug',
    loadComponent() {
      return import(
        './components/name-card-public/name-card-public.component'
      ).then((m) => m.NameCardPublicComponent);
    },
  },
  {
    path: 'edit/name-card/:slug',
    loadComponent() {
      return import(
        './components/name-card-insert-update/name-card-insert-update.component'
      ).then((m) => m.NameCardInsertUpdateComponent);
    },
  },
  {
    path: 'view/name-card/:slug',
    loadComponent() {
      return import(
        './components/user-name-card/user-name-card.component'
      ).then((m) => m.UserNameCardComponent);
    },
  },
  {
    path: ':id',
    loadComponent() {
      return import('./components/home/home.component').then(
        (m) => m.HomeComponent
      );
    },
  },
  {
    path: '',
    loadComponent() {
      return import('./components/home/home.component').then(
        (m) => m.HomeComponent
      );
    },
  },
];
