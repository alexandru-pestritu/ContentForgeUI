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

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  
  { path: 'blogs', component: BlogsComponent, canActivate: [AuthGuard] },

  { path: ':blogId/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: ':blogId/stores', component: StoresComponent, canActivate: [AuthGuard] },
  { path: ':blogId/products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: ':blogId/articles', component: ArticlesComponent, canActivate: [AuthGuard] },
  { path: ':blogId/ai/prompts', component: PromptsComponent, canActivate: [AuthGuard] },
  { path: ':blogId/ai/product', component: ProductContentComponent, canActivate: [AuthGuard] },
  { path: ':blogId/ai/article', component: ArticleContentComponent, canActivate: [AuthGuard] },
  { path: ':blogId/widgets/generate', component: WidgetsGeneratorComponent, canActivate: [AuthGuard] },
  
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },

  { path: '', redirectTo: '/blogs', pathMatch: 'full' },
  { path: '**', redirectTo: '/blogs' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
