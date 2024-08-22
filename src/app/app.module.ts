import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ButtonModule } from 'primeng/button';
import {InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { Menu, MenuModule } from 'primeng/menu';
import { PasswordModule } from 'primeng/password';
import { AuthInterceptor } from './services/http/interceptors/auth.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {AvatarModule} from 'primeng/avatar';
import {ImageModule} from 'primeng/image';
import {TableModule} from 'primeng/table';
import { StoresComponent } from './components/stores/stores.component';
import { MessageService } from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {DialogModule} from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common'
import {CheckboxModule} from 'primeng/checkbox';
import { ProductsComponent } from './components/products/products.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    StoresComponent,
    ProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    InputTextModule,
    MenubarModule,
    ReactiveFormsModule,
    PasswordModule,
    HttpClientModule,
    MenuModule,
    AvatarModule,
    ImageModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    FormsModule,
    ConfirmDialogModule,
    CommonModule,
    CheckboxModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
