import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './services/guards/auth-guard';
import { LoginGuard } from './services/guards/login-guard';
import { StoresComponent } from './components/stores/stores.component';
import { ProductsComponent } from './components/products/products.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { PromptsComponent } from './components/prompts/prompts.component';
import { ProductContentComponent } from './components/product-content/product-content.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'stores', component: StoresComponent, canActivate: [AuthGuard] },
  { path:'products', component: ProductsComponent, canActivate: [AuthGuard]},
  { path: 'articles', component: ArticlesComponent, canActivate: [AuthGuard]},
  { path:'ai/prompts', component: PromptsComponent, canActivate: [AuthGuard]},
  { path: 'ai/product', component: ProductContentComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
