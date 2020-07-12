import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './services/auth.guard'
import { ContactsComponent } from './contacts/contacts.component';
import { ChatHomeComponent } from './chat-home/chat-home.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'chat', component: ChatComponent, canActivate: [AuthGuard], children: [
      { path: '', component: ChatHomeComponent },
      { path: 'home', component: ChatHomeComponent },
      { path: 'contacts', component: ContactsComponent },
    ]
  },

  { path: '**', redirectTo: '' }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
