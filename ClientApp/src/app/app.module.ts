import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { UserService } from './services/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from './services/notification.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { NgSpinnerModule } from 'ng-bootstrap-spinner';
import { ContactsComponent } from './contacts/contacts.component';
import { SearchService } from './services/search.service';
import { ContactService } from './services/contact.service';
import { ChatHomeComponent } from './chat-home/chat-home.component';
import { RoomService } from './services/room.service';
import { MessageService } from './services/message.service';
import { SignalRService } from './services/signal-r.service';
import { TimeagoModule, TimeagoFormatter, Suffix, Unit } from 'ngx-timeago';

class CustomFormatter extends TimeagoFormatter {
  format(then: number): string {
    const now = Date.now();
    const seconds = Math.round(Math.abs(now - then) / 1000);
    const suffix: Suffix = then < now ? 'ago' : 'from now';
  
    const MINUTE = 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;
    const WEEK = DAY * 7;
    const MONTH = DAY * 30;
    const YEAR = DAY * 365;
    
    if (seconds < 5)
      return 'now';

    if (seconds < MINUTE)
      return 'less than a minute ago';

    const [value, unit]: [number, Unit] =
      seconds < HOUR
        ? [Math.round(seconds / MINUTE), 'minute']
        : seconds < DAY
          ? [Math.round(seconds / HOUR), 'hour']
          : seconds < WEEK
            ? [Math.round(seconds / DAY), 'day']
            : seconds < MONTH
              ? [Math.round(seconds / WEEK), 'week']
              : seconds < YEAR
                ? [Math.round(seconds / MONTH), 'month']
                : [Math.round(seconds / YEAR), 'year'];

    return this.parse(value, unit, suffix);
  }

  private parse(value: number, unit: Unit, suffix: Suffix): string {
    if (value !== 1) {
      unit += 's';
    }
    return value + ' ' + unit + ' ' + suffix;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ChatComponent,
    ContactsComponent,
    ChatHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgSpinnerModule,
    TimeagoModule.forRoot({
      formatter: {provide: TimeagoFormatter, useClass: CustomFormatter}
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    UserService,
    NotificationService,
    SearchService,
    ContactService,
    RoomService,
    MessageService,
    SignalRService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
