import { Component } from '@angular/core';
import { Setting } from '../../models/settings/setting';
import { SettingsService } from '../../services/settings/settings.service';
import { NotificationService } from '../../services/notification/notification.service';
import { AIService } from '../../services/ai/ai.service';
import { PlaceholderService } from '../../services/placeholder/placeholder.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  settingsByCategory: { [key: string]: Setting[] } = {};
  categories: string[] = [
    'Scraping',
    'AI Generation',
    'Specifications Filtering',
    'Images - Store',
    'Images - Product',
    'Images - Article Main',
    'Images - Article Guide'
  ];

  private icons: { [key: string]: string } = {
    'Scraping': 'pi pi-cloud-download',
    'AI Generation': 'pi pi-microchip-ai',
    'Specifications Filtering': 'pi pi-sliders-h',
    'Images - Store': 'pi pi-image',
    'Images - Product': 'pi pi-image',
    'Images - Article Main': 'pi pi-image',
    'Images - Article Guide': 'pi pi-image',
  };

  aiProviders: string[] = [];
  aiModels: { provider: string, model: string }[] = [];
  filteredModels: string[] = [];
  selectedAIModel: string | null = null;
  placeholdersByType: { [key: string]: string[] } = {};

  constructor(
    private settingsService: SettingsService,
    private notificationService: NotificationService,
    private aiService: AIService,
    private placeholderService : PlaceholderService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
    this.loadAIProvidersAndModels();
    this.loadPlaceholders();
  }

  loadSettings(): void {
    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        const images = settings.filter(s => s.key.startsWith('images.'));
        this.settingsByCategory = {
          Scraping: this.sortSettings(settings.filter(s => s.key.startsWith('scraping.'))),
          'AI Generation': this.sortSettings(settings.filter(s => s.key.startsWith('ai.'))),
          'Specifications Filtering': this.sortSettings(settings.filter(s => s.key.startsWith('specifications.'))),
          'Images - Store': this.sortSettings(images.filter(s => s.key.includes('.store.'))),
          'Images - Product': this.sortSettings(images.filter(s => s.key.includes('.product.'))),
          'Images - Article Main': this.sortSettings(images.filter(s => s.key.includes('.article_main.'))),
          'Images - Article Guide': this.sortSettings(images.filter(s => s.key.includes('.article_guide.'))),
        };

        const defaultModelSetting = this.settingsByCategory['AI Generation']?.find(s => s.key === 'ai.model.default');
        this.selectedAIModel = defaultModelSetting ? defaultModelSetting.value : null;
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to load settings.');
      }
    });
  }

  loadAIProvidersAndModels(): void {
    this.aiService.getProviders('text', 'chat').subscribe({
      next: (data) => {
        this.aiProviders = Object.keys(data);
        for (const provider in data) {
          if (data.hasOwnProperty(provider)) {
            const models = data[provider];
            models.forEach((modelInfo: { model: string }) => {
              this.aiModels.push({ provider, model: modelInfo.model });
            });
          }
        }
        const defaultProviderSetting = this.settingsByCategory['AI Generation']?.find(s => s.key === 'ai.provider.default');
        if (defaultProviderSetting) {
          this.onAIProviderChange(defaultProviderSetting.value, false);
        }
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to load AI providers and models.');
      }
    });
  }

  loadPlaceholders(): void {
    const types = ['Store', 'Product', 'Article'];
    types.forEach(type => {
      this.placeholderService.getPlaceholdersByType(type).subscribe({
        next: (placeholders) => {
          this.placeholdersByType[type] = placeholders;
          this.placeholdersByType[type] = this.placeholdersByType[type].filter(placeholder => placeholder !== '{output}');
        },
        error: () => {
          this.notificationService.showError('Error', `Failed to load placeholders for ${type}.`);
        }
      });
    });
  }

  onAIProviderChange(provider: string, updateBackend: boolean = true): void {
    this.filteredModels = this.aiModels
      .filter(model => model.provider === provider)
      .map(model => model.model);

    const defaultProviderSetting = this.settingsByCategory['AI Generation']?.find(s => s.key === 'ai.provider.default');
    if (defaultProviderSetting && updateBackend) {
      this.validateAndUpdate(defaultProviderSetting, provider);
    }
  }

  onAIModelChange(model: string): void {
    const defaultModelSetting = this.settingsByCategory['AI Generation']?.find(s => s.key === 'ai.model.default');
    if (defaultModelSetting) {
      this.validateAndUpdate(defaultModelSetting, model);
    }
  }

  sortSettings(settings: Setting[]): Setting[] {
    return settings.sort((a, b) => a.key.localeCompare(b.key));
  }

  getSortedSettingsByCategory(category: string): Setting[] {
    return this.settingsByCategory[category] || [];
  }

  getIconForCategory(category: string): string {
    return this.icons[category] || 'pi-cog';
  }

  isApiKeySetting(key: string): boolean {
    return key.includes('api_key');
  }

  isAIProviderSetting(key: string): boolean {
    return key === 'ai.provider.default';
  }

  isAIModelSetting(key: string): boolean {
    return key === 'ai.model.default';
  }

  getPlaceholderType(category: string): string {
    const mapping: { [key: string]: string } = {
      'Images - Store': 'Store',
      'Images - Product': 'Product',
      'Images - Article Main': 'Article',
      'Images - Article Guide': 'Article'
    };
    return mapping[category] || '';
  }

  onInputChange(setting: Setting, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value;
    this.validateAndUpdate(setting, newValue);
  }

  validateAndUpdate(setting: Setting, newValue: any): void {
    try {
      switch (setting.type) {
        case 'integer':
          if (isNaN(parseInt(newValue, 10))) throw new Error('Value must be an integer.');
          break;
        case 'float':
          if (isNaN(parseFloat(newValue))) throw new Error('Value must be a float.');
          break;
        case 'boolean':
          if (typeof newValue !== 'boolean') throw new Error('Value must be true or false.');
          break;
        case 'string':
          if (typeof newValue !== 'string') throw new Error('Value must be a string.');
          break;
        default:
          throw new Error('Unsupported type.');
      }

      const updatedSetting = { ...setting, value: newValue };
      this.settingsService.updateSetting(setting.key, updatedSetting).subscribe({
        next: () => {
          const sanitizedDescription = setting.description.endsWith('.') ? setting.description.slice(0, -1) : setting.description;
          this.notificationService.showSuccess('Success', `${sanitizedDescription} updated successfully.`);
        },
        error: () => {
          const sanitizedDescription = setting.description.endsWith('.') ? setting.description.slice(0, -1) : setting.description;
          this.notificationService.showError('Error', `Failed to update ${sanitizedDescription}.`);
        }
      });
    } catch (error: any) {
      this.notificationService.showError('Validation Error', error.message);
    }
  }
}