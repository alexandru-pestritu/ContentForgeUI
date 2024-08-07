import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
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
    private authService : AuthService
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
              items: [
                {
                  label: 'Add Store',
                  icon: 'pi pi-fw pi-plus',
                  routerLink: '/stores/add'
                },
                {
                  label: 'Manage Stores',
                  icon: 'pi pi-fw pi-pencil',
                  routerLink: '/stores'
                }
              ]
            },
            {
              label: 'Products',
              icon: 'pi pi-fw pi-shopping-cart',
              items: [
                {
                  label: 'Add Product',
                  icon: 'pi pi-fw pi-plus',
                  routerLink: '/products/add'
                },
                {
                  label: 'Manage Products',
                  icon: 'pi pi-fw pi-pencil',
                  routerLink: '/products'
                }
              ]
            },
            {
              label: 'Articles',
              icon: 'pi pi-fw pi-align-left',
              items: [
                {
                  label: 'Add Article',
                  icon: 'pi pi-fw pi-plus',
                  routerLink: '/articles/add'
                },
                {
                  label: 'Manage Articles',
                  icon: 'pi pi-fw pi-pencil',
                  routerLink: '/articles'
                }
              ]
            }
          ]
        },
        {
          label: 'AI Content Generator',
          icon: 'pi pi-fw pi-microchip-ai',
          items: [
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
            this.authService.logout();
          }
        }
      ];
    }
}
