import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { AuthService } from './services/auth/auth.service';
import { BlogService } from './services/blog/blog.service';
import { Blog } from './models/blog/blog';
import { BlogContextService } from './services/blog/blog-context.service';
import { Dropdown } from 'primeng/dropdown';

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

  blogs: Blog[] = [];
  selectedBlogId: number | null = null;

  blogDropdownOptions: { label: string; value: number | string; favicon_url?: string }[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private blogService: BlogService,
    private blogContext: BlogContextService
  ) {}


  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.loadBlogs();
      } else {
        this.blogs = [];
        this.selectedBlogId = null;
        this.generateMenuItems();
      }
    });

    this.blogContext.activeBlogId$.subscribe(blogId => {
      this.selectedBlogId = blogId;
      this.generateMenuItems();
    });

    this.generateUserMenuItems();
    this.generateMenuItems();
  }

  loadBlogs(): void {
    this.blogService.getBlogs(0, 100).subscribe({
      next: (data) => {
        this.blogs = data.blogs;
        this.buildBlogDropdownOptions();
        this.generateMenuItems();
      },
      error: (err) => {
        console.error('Error loading blogs', err);
      }
    });
  }

  buildBlogDropdownOptions(): void {
    const blogItems = this.blogs.map((b) => ({
      label: b.name,
      value: b.id,
      favicon_url: `https://www.google.com/s2/favicons?domain=${b.base_url}`
    }));
    this.blogDropdownOptions = [...blogItems];
  }

  onChangeBlog(event: any): void {
    const newValue = event.value;
      this.blogContext.setActiveBlogId(newValue);
      this.router.navigate(['/', newValue, 'dashboard']);
  }

  gotoManageBlogs(dropdownRef: Dropdown) {
    dropdownRef.hide();
    this.router.navigate(['/blogs']);
  }  

  generateMenuItems() {
    const blogId = this.selectedBlogId || '';

    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: blogId ? `/${blogId}/dashboard` : null,
        disabled: !blogId
      },
      {
        label: 'Manage Data',
        icon: 'pi pi-fw pi-database',
        disabled: !blogId,
        items: [
          {
            label: 'Stores',
            icon: 'pi pi-fw pi-shop',
            routerLink: blogId ? `/${blogId}/stores` : null,
            disabled: !blogId
          },
          {
            label: 'Products',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: blogId ? `/${blogId}/products` : null,
            disabled: !blogId
          },
          {
            label: 'Articles',
            icon: 'pi pi-fw pi-align-left',
            routerLink: blogId ? `/${blogId}/articles` : null,
            disabled: !blogId
          }
        ]
      },
      {
        label: 'AI Content Generator',
        icon: 'pi pi-fw pi-microchip-ai',
        disabled: !blogId,
        items: [
          {
            label: 'AI Prompts',
            icon: 'pi pi-fw pi-comment',
            routerLink: blogId ? `/${blogId}/ai/prompts` : null,
            disabled: !blogId
          },
          {
            label: 'Product Content',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: blogId ? `/${blogId}/ai/product` : null,
            disabled: !blogId
          },
          {
            label: 'Article Content',
            icon: 'pi pi-fw pi-align-left',
            routerLink: blogId ? `/${blogId}/ai/article` : null,
            disabled: !blogId
          }
        ]
      },
      {
        label: 'Widgets Generator',
        icon: 'pi pi-fw pi-th-large',
        routerLink: blogId ? `/${blogId}/widgets/generate` : null,
        disabled: !blogId
      }
    ];
  }

  generateUserMenuItems() {
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

  logout() {
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