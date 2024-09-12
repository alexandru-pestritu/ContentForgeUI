import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product/product';
import { ProductService } from '../../services/product/product.service';
import { WidgetService } from '../../services/widgets/widget.service';
import { ArticleService } from '../../services/article/article.service';
import { NotificationService } from '../../services/notification/notification.service';
import { Article } from '../../models/article/article';

@Component({
  selector: 'app-widgets-generator',
  templateUrl: './widgets-generator.component.html',
  styleUrls: ['./widgets-generator.component.scss']
})
export class WidgetsGeneratorComponent implements OnInit {

  products: Product[] = [];
  selectedProduct: Product | null = null;
  productWidgetContent: string = '';

  articles: Article[] = [];
  selectedArticle: Article | null = null;
  articleWidgetContent: string = '';
  publishToWP: boolean = false;

  productLoading: boolean = false;
  articleLoading: boolean = false;

  constructor(
    private productService: ProductService,
    private articleService: ArticleService,
    private widgetService: WidgetService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  searchProducts(event: any) {
    const query = event.query;
    this.productService.getProducts(0, 10, undefined, undefined, query).subscribe({
      next: (data) => {
        this.products = data.products.map(product => ({
          ...product,
          displayName: `ID: ${product.id}, ${product.name} - ${product.seo_keyword}`
        }));
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to fetch products.');
      }
    });
  }

  searchArticles(event: any) {
    const query = event.query;
    this.articleService.getArticles(0, 10, undefined, undefined, query).subscribe({
      next: (data) => {
        this.articles = data.articles.map(article => ({
          ...article,
          displayName: `ID: ${article.id}, ${article.title}`
        }));
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to fetch articles.');
      }
    });
  }

  generateProductWidget() {
    this.productLoading = true;
    if (this.selectedProduct) {
      this.widgetService.generateProductWidget(this.selectedProduct.id).subscribe({
        next: (data) => {
          this.productWidgetContent = data.content;
          this.productLoading = false;
          this.notificationService.showSuccess('Success', 'Product widget generated successfully.');
        },
        error: (err) => {
          this.productLoading = false;
          this.notificationService.showError('Error', 'Failed to generate product widget.');
        }
      });
    }
  }

  generateArticleWidget() {
    this.articleLoading = true;
    if (this.selectedArticle) {
      this.widgetService.generateArticleWidget(this.selectedArticle.id, this.publishToWP).subscribe({
        next: (data) => {
          this.articleWidgetContent = data.content;
          this.articleLoading = false;
          this.notificationService.showSuccess('Success', 'Article widget generated successfully.');
        },
        error: (err) => {
          this.articleLoading = false;
          this.notificationService.showError('Error', 'Failed to generate article widget.');
        }
      });
    }
  }
}
