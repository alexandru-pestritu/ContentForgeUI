import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ContentForgeUI';
  items: MenuItem[] | undefined;
  userItems: MenuItem[] | undefined;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService : AuthService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
      });

      this.items = [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-home',
          routerLink: '/dashboard'
        },
        {
          label: 'Manage Data',
          icon: 'pi pi-fw pi-database',
          items: [
            {
              label: 'Stores',
              icon: 'pi pi-fw pi-shop',
              routerLink: '/stores'
            },
            {
              label: 'Products',
              icon: 'pi pi-fw pi-shopping-cart',
              routerLink: '/products'
            },
            {
              label: 'Articles',
              icon: 'pi pi-fw pi-align-left',
              routerLink: '/articles'
            }
          ]
        },
        {
          label: 'AI Content Generator',
          icon: 'pi pi-fw pi-microchip-ai',
          items: [
            {
              label: 'AI Prompts',
              icon: 'pi pi-fw pi-comment',
              routerLink: '/ai/prompts'
            },
            {
              label: 'Product Content',
              icon: 'pi pi-fw pi-shopping-cart',
              routerLink: '/ai/product'
            },
            {
              label: 'Article Content',
              icon: 'pi pi-fw pi-align-left',
              routerLink: '/ai/article'
            }
          ]
        },
        {
            label: 'Widgets Generator',
            icon: 'pi pi-fw pi-th-large',
            items: [
              {
                label: 'Single Widget',
                icon: 'pi pi-fw pi-stop',
                routerLink: '/widgets/single'
              },
              {
                label: 'Product Widgets',
                icon: 'pi pi-fw pi-shopping-cart',
                routerLink: '/widgets/product'
              },
              {
                label: 'Article Widgets',
                icon: 'pi pi-fw pi-align-left',
                routerLink: '/widgets/article'
              }
            ]
        }
      ];
  
      this.userItems = [
        {
          label: 'Settings',
          icon: 'pi pi-fw pi-cog',
          routerLink: '/settings'
        },
        {
          label: 'Logout',
          icon: 'pi pi-fw pi-power-off',
          command: () => {
            this.logout();
          }
        }
      ];
    }

    logout(){
      this.confirmationService.confirm({
        message: 'Are you sure you want to logout?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.authService.logout();
        }
      });
    }
}
