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
import { ArticleContentComponent } from './components/article-content/article-content.component';
import { WidgetsGeneratorComponent } from './components/widgets-generator/widgets-generator.component';
import { SettingsComponent } from './components/settings/settings.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { SetupComponent } from './components/setup/setup.component';
import { SetupGuard } from './services/guards/setup-guard';
import { SetupCompletedGuard } from './services/guards/setup-completed-guard';

const routes: Routes = [
  {
    path: 'setup',
    component: SetupComponent,
    canActivate: [SetupCompletedGuard]
  },

  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [SetupGuard, LoginGuard] 
  },
  
  { 
    path: 'blogs', 
    component: BlogsComponent, 
    canActivate: [SetupGuard, AuthGuard] 
  },

  {
    path: ':blogId/dashboard',
    component: DashboardComponent,
    canActivate: [SetupGuard, AuthGuard] 
  },
  {
    path: ':blogId/stores',
    component: StoresComponent,
    canActivate: [SetupGuard, AuthGuard] 
  },
  {
    path: ':blogId/products',
    component: ProductsComponent,
    canActivate: [SetupGuard, AuthGuard] 
  },
  {
    path: ':blogId/articles',
    component: ArticlesComponent,
    canActivate: [SetupGuard, AuthGuard] 
  },
  {
    path: ':blogId/ai/prompts',
    component: PromptsComponent,
    canActivate: [SetupGuard, AuthGuard] 
  },
  {
    path: ':blogId/ai/product',
    component: ProductContentComponent,
    canActivate: [SetupGuard, AuthGuard] 
  },
  {
    path: ':blogId/ai/article',
    component: ArticleContentComponent,
    canActivate: [SetupGuard, AuthGuard] 
  },
  {
    path: ':blogId/widgets/generate',
    component: WidgetsGeneratorComponent,
    canActivate: [SetupGuard, AuthGuard] 
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [SetupGuard, AuthGuard] 
  },

  { path: '', redirectTo: '/blogs', pathMatch: 'full' },
  { path: '**', redirectTo: '/blogs' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
