import { Component, OnInit } from '@angular/core';
import { Blog } from '../../models/blog/blog';
import { BlogService } from '../../services/blog/blog.service';
import { NotificationService } from '../../services/notification/notification.service';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { BlogContextService } from '../../services/blog/blog-context.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];

  blogDialogVisible: boolean = false;
  editingBlog: Blog = {} as Blog;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private blogService: BlogService,
    private blogContext: BlogContextService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogs(0, 999).subscribe({
      next: (data) => {
        this.blogs = data.blogs;
      },
      error: (err) => {
        console.error('Error fetching blogs', err);
        this.notificationService.showError('Error', 'Failed to load blogs.');
      }
    });
  }


  onSelectBlog(blog: Blog): void {
    this.blogContext.setActiveBlogId(blog.id);
    this.router.navigate([`/${blog.id}/dashboard`]);
  }

  onAddNewBlog(): void {
    this.editingBlog = {} as Blog;
    this.blogDialogVisible = true;
    this.submitted = false;
    this.loading = false;
  }

  onEditBlog(blog: Blog): void {
    this.editingBlog = { ...blog };
    this.blogDialogVisible = true;
    this.submitted = false;
    this.loading = false;
  }

  hideDialog(): void {
    this.blogDialogVisible = false;
    this.editingBlog = {} as Blog;
    this.submitted = false;
    this.loading = false;
  }

  saveBlog(): void {
    this.submitted = true;

    if (!this.editingBlog.name || !this.editingBlog.base_url ||
        !this.editingBlog.username || !this.editingBlog.api_key) {
      return;
    }

    this.loading = true;

    if (this.editingBlog.id) {
      this.blogService.updateBlog(this.editingBlog.id, this.editingBlog).subscribe({
        next: (updated) => {
          this.notificationService.showSuccess('Success', 'Blog updated successfully.');
          this.blogDialogVisible = false;
          this.loadBlogs();
          this.loading = false;
          this.appComponent.loadBlogs();
        },
        error: (err) => {
          console.error('Error updating blog', err);
          this.notificationService.showError('Error', 'Failed to update blog.');
          this.loading = false;
        }
      });
    } else {
      const newBlogData = {
        name: this.editingBlog.name,
        base_url: this.editingBlog.base_url,
        username: this.editingBlog.username,
        api_key: this.editingBlog.api_key,
        logo_url: this.editingBlog.logo_url
      };
      this.blogService.createBlog(newBlogData).subscribe({
        next: (created) => {
          this.notificationService.showSuccess('Success', 'Blog created successfully.');
          this.blogDialogVisible = false;
          this.loadBlogs();
          this.loading = false;
          this.appComponent.loadBlogs();
        },
        error: (err) => {
          console.error('Error creating blog', err);
          this.notificationService.showError('Error', 'Failed to create blog.');
          this.loading = false;
        }
      });
    }
  }

  onDeleteBlog(): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${this.editingBlog.name}"?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.blogService.deleteBlog(this.editingBlog.id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Success', `Blog "${this.editingBlog.name}" deleted successfully.`);
            this.blogDialogVisible = false;
            this.loadBlogs();
            this.loading = false;
            this.appComponent.loadBlogs();
          },
          error: (err) => {
            console.error('Error deleting blog', err);
            this.notificationService.showError('Error', `Failed to delete blog "${this.editingBlog.name}".`);
            this.loading = false;
          }
        });
      }
    });
  }

  get cardClass(): string {
    return 'shadow-md hover:shadow-lg transition-shadow rounded-md';
  }
}
