import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article/article.service';
import { PromptService } from '../../services/prompt/prompt.service';
import { AIService } from '../../services/ai/ai.service';
import { Article } from '../../models/article/article';
import { Prompt } from '../../models/prompt/prompt';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-article-content',
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.scss']
})
export class ArticleContentComponent implements OnInit {
  articles: Article[] = [];
  private _selectedArticle: Article | null = null;

  get selectedArticle(): Article | null {
    return this._selectedArticle;
  }

  set selectedArticle(article: Article | null) {
    this._selectedArticle = article;
    if (article) {
      this.faqsList = article.faqs || [];
    } else {
      this.faqsList = [];
    }
  }

  providers: string[] = [];
  models: { provider: string, model: string, cost: string }[] = [];
  
  sectionPrompts: { [key: string]: Prompt[] } = {};
  selectedSectionPrompts: { [key: string]: Prompt | null } = {
    introduction: null,
    buyersGuide: null,
    faqs: null,
    conclusion: null
  };

  selectedSectionProviders: { [key: string]: string | null } = {
    introduction: null,
    buyersGuide: null,
    faqs: null,
    conclusion: null
  };

  selectedSectionModels: { [key: string]: { model: string, cost: string } | null } = {
    introduction: null,
    buyersGuide: null,
    faqs: null,
    conclusion: null
  };

  sectionModels: { [key: string]: { model: string, cost: string }[] } = {
    introduction: [],
    buyersGuide: [],
    faqs: [],
    conclusion: []
  };

  faqsList: { title: string, description: string }[] = [];
  isGeneratingContent: { [key: string]: boolean } = {
    introduction: false,
    buyersGuide: false,
    faqs: false,
    conclusion: false
  };

  sectionEnabled: { [key: string]: boolean } = {
    introduction: false,
    buyersGuide: false,
    faqs: false,
    conclusion: false
  };

  reviewCost: string = '';

  constructor(
    private articleService: ArticleService,
    private promptService: PromptService,
    private aiService: AIService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPrompts();
    this.loadProvidersAndModels();
  }

  searchArticles(event: any) {
    const query = event.query;
    this.articleService.getArticles(0, 10, "id", -1, query).subscribe({
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

  loadProvidersAndModels(): void {
    this.aiService.getProviders('text', 'chat').subscribe({
      next: (data) => {
        this.providers = Object.keys(data);
        for (const provider in data) {
          if (data.hasOwnProperty(provider)) {
            const models = data[provider];
            models.forEach((modelInfo: { model: string, cost: string }) => {
              this.models.push({ provider: provider, model: modelInfo.model, cost: modelInfo.cost });
            });
          }
        }
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to load providers');
      }
    });
  }

  loadPrompts(): void {
    this.promptService.getPromptsByTypeAndOptionalSubtype('Article').subscribe({
      next: (prompts) => {
        this.sectionPrompts['introduction'] = prompts.filter(p => p.subtype === 'Introduction');
        this.sectionPrompts['buyersGuide'] = prompts.filter(p => p.subtype === "Buyer's Guide");
        this.sectionPrompts['faqs'] = prompts.filter(p => p.subtype === 'FAQs');
        this.sectionPrompts['conclusion'] = prompts.filter(p => p.subtype === 'Conclusion');
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to load Article prompts');
      }
    });
  }
  
  onProviderChange(section: string, provider: string): void {
    this.selectedSectionProviders[section] = provider;
    this.sectionModels[section] = this.models.filter(model => model.provider === provider);
    this.selectedSectionModels[section] = null;
  }

  addFAQ(): void {
    this.faqsList.push({ title: '', description: '' });
  }

  removeFAQ(index: number): void {
    this.faqsList.splice(index, 1);
  }

  generateContent(section: string): void {
    const articleId = this.selectedArticle?.id;
    const prompt = this.selectedSectionPrompts[section];
    const provider = this.selectedSectionProviders[section];
    const model = this.selectedSectionModels[section];

    if (!articleId || !prompt || !provider || !model) return;

    this.isGeneratingContent[section] = true;
    this.aiService.generateArticleText(articleId, prompt!.id!, provider, model.model).subscribe({
      next: (data) => {
        this.selectedArticle = {
          ...data.article,
          displayName: `ID: ${data.article.id}, ${data.article.title}`
        };
        this.reviewCost = data.cost;
        this.notificationService.showSuccess('Success', `${section} generated successfully`);
        this.isGeneratingContent[section] = false;
      },
      error: (err) => {
        this.notificationService.showError('Error', `Failed to generate ${section}`);
        this.isGeneratingContent[section] = false;
      }
    });
  }

  updateArticle(): void {
    if (!this.selectedArticle) return;
    this.articleService.updateArticle(this.selectedArticle.id, this.selectedArticle).subscribe({
      next: () => {
        this.notificationService.showSuccess('Success', 'Article updated successfully');
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to update article');
      }
    });
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }

  isAnySectionEnabled(): boolean {
    return this.sectionEnabled['introduction'] || 
           this.sectionEnabled['buyersGuide'] || 
           this.sectionEnabled['faqs'] || 
           this.sectionEnabled['conclusion'];
  }
  
}
