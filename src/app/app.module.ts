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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipsModule } from 'primeng/chips';
import {InputSwitchModule} from 'primeng/inputswitch';
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
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { GalleriaModule } from 'primeng/galleria';
import { TagModule } from 'primeng/tag';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ArticlesComponent } from './components/articles/articles.component';
import { DropdownModule } from 'primeng/dropdown'
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import { PromptsComponent } from './components/prompts/prompts.component';
import { ProductContentComponent } from './components/product-content/product-content.component';
import { DividerModule } from 'primeng/divider';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    StoresComponent,
    ProductsComponent,
    ArticlesComponent,
    PromptsComponent,
    ProductContentComponent
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
    CheckboxModule,
    InputTextareaModule,
    InputNumberModule,
    ChipsModule,
    InputSwitchModule,
    RatingModule,
    ProgressSpinnerModule,
    TabViewModule,
    GalleriaModule,
    TagModule,
    AutoCompleteModule,
    DropdownModule,
    MultiSelectModule,
    EditorModule,
    DividerModule
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
