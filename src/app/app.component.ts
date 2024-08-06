import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ContentForgeUI';
  items: MenuItem[] | undefined;

  constructor(private router: Router) { }

  ngOnInit() {
    this.items = [
        {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            route: '/dashboard'
        },
        {
            label: 'Manage Data',
            icon: 'pi pi-fw pi-database',
            items: [
                {
                    label: 'Stores',
                    icon: 'pi pi-fw pi-shop',
                    route: '/stores',
                    items: [
                        {
                            label: 'Add Store',
                            icon: 'pi pi-fw pi-plus',
                            route: '/'
                        },
                        {
                            label: 'Manage Stores',
                            icon: 'pi pi-fw pi-pencil',
                            route: '/'
                        }
                    ]
                },
                {
                    label: 'Products',
                    icon: 'pi pi-fw pi-shopping-cart',
                    route: '/',
                    items: [
                        {
                            label: 'Add Product',
                            icon: 'pi pi-fw pi-plus',
                            route: '/'
                        },
                        {
                            label: 'Manage Products',
                            icon: 'pi pi-fw pi-pencil',
                            route: '/'
                        }
                    ]
                },
                {
                    label: 'Articles',
                    icon: 'pi pi-fw pi-align-left',
                    route: '/',
                    items: [
                        {
                            label: 'Add Article',
                            icon: 'pi pi-fw pi-plus',
                            route: '/'
                        },
                        {
                            label: 'Manage Articles',
                            icon: 'pi pi-fw pi-pencil',
                            route: '/'
                        }
                    ]
                }
            ]
        }
    ];
}
}
