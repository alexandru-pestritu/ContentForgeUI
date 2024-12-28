import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article/article.service';
import { PromptService } from '../../services/prompt/prompt.service';
import { AIService } from '../../services/ai/ai.service';
import { Article } from '../../models/article/article';
import { Prompt } from '../../models/prompt/prompt';
import { NotificationService } from '../../services/notification/notification.service';
import { SettingsService } from '../../services/settings/settings.service';
import { ActivatedRoute } from '@angular/router';

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

    const isEnabled = article !== null;
    this.sectionEnabled['introduction'] = isEnabled;
    this.sectionEnabled['buyersGuide'] = isEnabled;
    this.sectionEnabled['faqs'] = isEnabled;
    this.sectionEnabled['conclusion'] = isEnabled;
    if (article) {
      this.faqsList = article.faqs || [];
    } else {
      this.faqsList = [];
    }
  }

  providers: string[] = [];
  models: { provider: string, model: string, cost: string }[] = [];
  defaultProvider: string | null = null;
  defaultModel: string | null = null;
  
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

  blogId: number | null = null;

  constructor(
    private articleService: ArticleService,
    private promptService: PromptService,
    private aiService: AIService,
    private settingsService: SettingsService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('blogId');
      if (idParam) {
        this.blogId = +idParam;
        this.loadDefaults();
        this.loadPrompts();
        this.loadProvidersAndModels();
      }
    });
  }

  searchArticles(event: any) {
    if (!this.blogId) {
      this.notificationService.showError('Error', 'No blog selected!');
      return;
    }
    const query = event.query;
    this.articleService.getArticles(this.blogId, 0, 10, "id", -1, query).subscribe({
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
    if (!this.blogId) {
      return;
    }
    this.aiService.getProviders(this.blogId, 'text', 'chat').subscribe({
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

        if (this.defaultProvider) {
          Object.keys(this.sectionEnabled).forEach(section => {
            if (this.defaultProvider) {
              this.updateModelsForProvider(section, this.defaultProvider);
            }
          });
        }
      },
      error: () => {
        this.notificationService.showError('Error', 'Failed to load providers');
      }
    });
  }

  updateModelsForProvider(section: string, provider: string): void {
    this.sectionModels[section] = this.models.filter(model => model.provider === provider);

    if (this.defaultModel) {
      const defaultModel = this.sectionModels[section].find(m => m.model === this.defaultModel);
      this.selectedSectionModels[section] = defaultModel || null;
    }
  }

  loadDefaults(): void {
    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        const providerSetting = settings.find(s => s.key === 'ai.provider.default');
        const modelSetting = settings.find(s => s.key === 'ai.model.default');
        this.defaultProvider = providerSetting?.value || null;
        this.defaultModel = modelSetting?.value || null;

        if (this.defaultProvider) {
          Object.keys(this.sectionEnabled).forEach(section => {
            this.selectedSectionProviders[section] = this.defaultProvider;
          });
        }
      },
      error: () => {
        this.notificationService.showError('Error', 'Failed to load default settings.');
      }
    });
  }

  loadPrompts(): void {
    if (!this.blogId) {
      return;
    }
    this.promptService.getPromptsByTypeAndOptionalSubtype(this.blogId, 'Article').subscribe({
      next: (prompts) => {
        this.sectionPrompts['introduction'] = prompts.filter(p => p.subtype === 'Introduction');
        this.sectionPrompts['buyersGuide'] = prompts.filter(p => p.subtype === "Buyer's Guide");
        this.sectionPrompts['faqs'] = prompts.filter(p => p.subtype === 'FAQs');
        this.sectionPrompts['conclusion'] = prompts.filter(p => p.subtype === 'Conclusion');

        this.selectedSectionPrompts['introduction'] = this.sectionPrompts['introduction'][0];
        this.selectedSectionPrompts['buyersGuide'] = this.sectionPrompts['buyersGuide'][0];
        this.selectedSectionPrompts['faqs'] = this.sectionPrompts['faqs'][0];
        this.selectedSectionPrompts['conclusion'] = this.sectionPrompts['conclusion'][0];
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
    if (!this.blogId) {
      this.notificationService.showError('Error', 'No blog selected!');
      return;
    }
    const articleId = this.selectedArticle?.id;
    const prompt = this.selectedSectionPrompts[section];
    const provider = this.selectedSectionProviders[section];
    const model = this.selectedSectionModels[section];

    if (!articleId || !prompt || !provider || !model) return;

    this.isGeneratingContent[section] = true;
    this.aiService.generateArticleText(this.blogId, articleId, prompt!.id!, provider, model.model).subscribe({
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
    if (!this.blogId) {
      return;
    }
    this.articleService.updateArticle(this.blogId, this.selectedArticle.id, this.selectedArticle).subscribe({
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
