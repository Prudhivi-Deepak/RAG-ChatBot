// import { Routes } from '@angular/router';

// export const routes: Routes = [];

import { Routes } from '@angular/router';
import { ChatComponent } from './features/chat/chat.component';

export const routes: Routes = [
  { path: '', component: ChatComponent }, // This loads the chat on the homepage
  { path: '**', redirectTo: '' }          // Redirect any weird URLs to home
];