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
import moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  latestArticles: Article[] = [];
  stockCheckLogs: StockCheckLog[] = [];
  outOfStockProducts: { product: Product, articles: Article[] }[] = [];
  dashboardStats: DashboardStats | null = null;

  startDate: Date | null = null;
  endDate: Date | null = null;
  maxDate: Date = new Date(); 
  minDate: Date = new Date(2000, 0, 1); 
  quickFilters: { label: string, value: string }[] = [];
  selectedQuickFilter: string | null = null;

  chartData: any = {};
  chartOptions: any = {};

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
    this.loadOutOfStockProducts();
    this.initializeChartOptions();
    this.populateQuickFilters();
    this.applyQuickFilter({ value: 'last14days' });
  }

  loadDashboardStats(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats: DashboardStats) => {
        this.dashboardStats = stats;
      },
      error: (error: any) => {
        this.notificationService.showError('Dashboard Stats Error', 'Failed to load dashboard statistics.');
      }
    });
  }

  loadLatestArticles(): void {
    this.articleService.getLatestArticles(5).subscribe({
      next: (articles: Article[]) => {
        this.latestArticles = articles;
      },
      error: (error: any) => {
        this.notificationService.showError('Latest Articles Error', 'Failed to load latest articles.');
      }
    });
  }

  loadStockCheckLogs(startDate?: string, endDate?: string): void {
    this.stockCheckLogService.getStockCheckLogs(startDate, endDate).subscribe({
      next: (logs: StockCheckLog[]) => {
        this.stockCheckLogs = logs;
        this.updateChartData();
      },
      error: (error: any) => {
        this.notificationService.showError('Stock Check Logs Error', 'Failed to load stock check logs.');
      }
    });
  }

  loadOutOfStockProducts(): void {
    this.productService.getOutOfStockProducts().subscribe({
      next: (data: { product: Product, articles: Article[] }[]) => {
        this.outOfStockProducts = data;
      },
      error: (error: any) => {
        this.notificationService.showError('Out of Stock Products Error', 'Failed to load out of stock products.');
      }
    });
  }

  openAffiliateUrl(url: string): void {
    window.open(url, '_blank');
  }

  updateChartData(): void {
    const labels = this.stockCheckLogs.map(log => moment(log.check_time).format('YYYY-MM-DD'));
    const inStockData = this.stockCheckLogs.map(log => log.in_stock_count);
    const outOfStockData = this.stockCheckLogs.map(log => log.out_of_stock_count);
  
    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Out of Stock',
          data: outOfStockData,
          fill: 'origin',
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.5)',
          tension: 0.4,
          pointBackgroundColor: '#f97316',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 1,
          pointRadius: 5,
          pointHoverRadius: 7,
          order: 1 
        },
        {
          label: 'In Stock',
          data: inStockData,
          fill: 'origin', 
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          tension: 0.4,
          pointBackgroundColor: '#22c55e',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 1,
          pointRadius: 5,
          pointHoverRadius: 7,
          order: 2 
        }
      ]
    };
  }

  initializeChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true, 
            padding: 20
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        },
        title: {
          display: false,
          text: 'Stock Check Logs'
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Count'
          },
          beginAtZero: true 
        }
      }
    };
  }
  

  populateQuickFilters(): void {
    this.quickFilters = [
      { label: 'Last 14 Days', value: 'last14days' },
      { label: 'Last Month', value: 'lastMonth' },
      { label: 'Last 3 Months', value: 'lastThreeMonths' },
      { label: 'Last 6 Months', value: 'lastSixMonths' },
      { label: 'Last Year', value: 'lastYear' }
    ];
  }

  applyQuickFilter(event: { value: string }): void {
    switch (event.value) {
      case 'last14days':
        this.startDate = moment().subtract(14, 'days').toDate();
        break;
      case 'lastMonth':
        this.startDate = moment().subtract(1, 'month').toDate();
        break;
      case 'lastThreeMonths':
        this.startDate = moment().subtract(3, 'months').toDate();
        break;
      case 'lastSixMonths':
        this.startDate = moment().subtract(6, 'months').toDate();
        break;
      case 'lastYear':
        this.startDate = moment().subtract(1, 'year').toDate();
        break;
    }
    this.endDate = new Date();
    this.maxDate = this.endDate;
    this.selectedQuickFilter = event.value;
    this.filterStockLogs();
  }

  filterStockLogs(): void {
    if (!this.startDate || !this.endDate) {
      this.notificationService.showWarn('Date Range Missing', 'Please select both start and end dates.');
      return;
    }

    const start = moment(this.startDate).format('YYYY-MM-DD');
    const end = moment(this.endDate).format('YYYY-MM-DD');

    if (start > end) {
      this.notificationService.showWarn('Invalid Date Range', 'End date cannot be earlier than start date.');
      return;
    }
    this.loadStockCheckLogs(start, end);
  }
}
