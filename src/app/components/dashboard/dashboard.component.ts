import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product/product';
import { Article } from '../../models/article/article';
import { StockCheckLog } from '../../models/stock-check-log/stock-check-log';
import { DashboardStats } from '../../models/dashboard/dashboard-stats';
import { ArticleService } from '../../services/article/article.service';
import { StockCheckLogService } from '../../services/stock-check-log/stock-check-log.service';
import { ProductService } from '../../services/product/product.service';
import { NotificationService } from '../../services/notification/notification.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  latestArticles: Article[] = [];
  stockCheckLogs: StockCheckLog[] = [];
  outOfStockProducts: { product: Product, articles: Article[] }[] = [];
  dashboardStats: DashboardStats | null = null; 

  constructor(
    private articleService: ArticleService,
    private stockCheckLogService: StockCheckLogService,
    private productService: ProductService,
    private dashboardService: DashboardService,
    private notificationService: NotificationService  
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadLatestArticles();
    this.loadStockCheckLogs();
    this.loadOutOfStockProducts();
  }

  loadDashboardStats(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats: DashboardStats) => {
        this.dashboardStats = stats;
        console.log('Dashboard Stats:', this.dashboardStats);
      },
      error: (error: any) => {
        this.notificationService.showError('Dashboard Stats Error', 'Failed to load dashboard statistics.');
        console.error('Error fetching dashboard stats:', error);
      }
    });
  }

  loadLatestArticles(): void {
    this.articleService.getLatestArticles(3).subscribe({
      next: (articles: Article[]) => {
        this.latestArticles = articles;
        console.log('Latest Articles:', this.latestArticles);
      },
      error: (error: any) => {
        this.notificationService.showError('Latest Articles Error', 'Failed to load latest articles.');
        console.error('Error fetching latest articles:', error);
      }
    });
  }

  loadStockCheckLogs(): void {
    this.stockCheckLogService.getStockCheckLogs().subscribe({
      next: (logs: StockCheckLog[]) => {
        this.stockCheckLogs = logs;
        console.log('Stock Check Logs:', this.stockCheckLogs);
      },
      error: (error: any) => {
        this.notificationService.showError('Stock Check Logs Error', 'Failed to load stock check logs.');
        console.error('Error fetching stock check logs:', error);
      }
    });
  }

  loadOutOfStockProducts(): void {
    this.productService.getOutOfStockProducts().subscribe({
      next: (data: { product: Product, articles: Article[] }[]) => {
        this.outOfStockProducts = data;
        console.log('Out of Stock Products:', this.outOfStockProducts);
      },
      error: (error: any) => {
        this.notificationService.showError('Out of Stock Products Error', 'Failed to load out of stock products.');
        console.error('Error fetching out of stock products:', error);
      }
    });
  }

  openAffiliateUrl(url: string): void {
    window.open(url, '_blank');
  }  
}
