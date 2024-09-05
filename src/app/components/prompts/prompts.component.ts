import { Component, OnInit, ViewChild } from '@angular/core';
import { PromptService } from '../../services/prompt/prompt.service';
import { Prompt } from '../../models/prompt/prompt';
import { NotificationService } from '../../services/notification/notification.service';
import { ConfirmationService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { forkJoin, Observable } from 'rxjs';
import { TypesAndSubtypesResponse } from '../../models/prompt/types-and-subtypes-response';
import { Editor } from 'primeng/editor';

@Component({
  selector: 'app-prompts',
  templateUrl: './prompts.component.html',
  styleUrls: ['./prompts.component.scss']
})
export class PromptsComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;
  @ViewChild('editorAdd') editorAdd: Editor | undefined;  
  @ViewChild('editorEdit') editorEdit: Editor | undefined;

  prompts: Prompt[] = [];
  totalRecords: number = 0;
  rows: number = 10;
  selectedPrompts: Prompt[] = [];
  prompt: Prompt = {} as Prompt;
  selectedPrompt: Prompt = {} as Prompt;
  viewDialog: boolean = false;
  addDialog: boolean = false;
  editDialog: boolean = false;
  submitted: boolean = false;

  loading: boolean = false;

  types: string[] = [];
  subtypes: string[] = [];
  placeholders: string[] = [];

  constructor(
    private promptService: PromptService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadPrompts(0, this.rows);
    this.loadTypesAndSubtypes();
  }

  loadPrompts(skip: number, limit: number, sortField?: string, sortOrder?: number, filter?: string): void {
    this.promptService.getPrompts(skip, limit, sortField, sortOrder, filter).subscribe({
      next: (data) => {
        this.prompts = data.prompts;
        this.totalRecords = data.total_records;
      },
      error: (err) => {
        console.error('Error fetching prompts', err);
        this.notificationService.showError('Error', 'Failed to load prompts.');
      }
    });
  }

  loadPromptsLazy(event: TableLazyLoadEvent): void {
    const skip = event.first || 0;
    const limit = event.rows !== null && event.rows !== undefined ? event.rows : this.rows;
    const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField || undefined;
    const sortOrder = event.sortOrder || undefined;
    const globalFilter = Array.isArray(event.globalFilter) ? event.globalFilter[0] : event.globalFilter || undefined;

    this.loadPrompts(skip, limit, sortField, sortOrder, globalFilter);
  }

  openNewPrompt() {
    this.prompt = {} as Prompt;
    this.addDialog = true;
    this.submitted = false;
    this.loadPlaceholders(this.prompt.type); 
  }

  onTypeChange(event: any) {
    this.loadSubtypes(event.value);
    this.loadPlaceholders(event.value);
  }

  editPrompt(prompt: Prompt) {
    this.prompt = { ...prompt };
    this.editDialog = true;
    this.submitted = false;
    this.loadSubtypes(prompt.type);
    this.loadPlaceholders(prompt.type);
  }

  viewPrompt(prompt: Prompt) {
    this.selectedPrompt = { ...prompt };
    this.viewDialog = true;
  }

  savePrompt() {
    this.submitted = true;
    if (this.isValidPrompt(this.prompt)) {
      this.loading = true;
      this.promptService.createPrompt(this.prompt).subscribe({
        next: () => {
          this.notificationService.showSuccess('Success', 'Prompt created successfully.');
          this.loadPrompts(0, this.rows);
          this.loading = false;
          this.addDialog = false;
        },
        error: (err) => {
          console.error('Error creating prompt', err);
          this.notificationService.showError('Error', 'Failed to create prompt.');
          this.loading = false;
        }
      });
    }
  }

  updatePrompt() {
    this.submitted = true;
    if (this.isValidPrompt(this.prompt)) {
      this.loading = true;
      this.promptService.updatePrompt(this.prompt.id!, this.prompt).subscribe({
        next: () => {
          this.notificationService.showSuccess('Success', 'Prompt updated successfully.');
          this.loadPrompts(0, this.rows);
          this.loading = false;
          this.editDialog = false;
        },
        error: (err) => {
          console.error('Error updating prompt', err);
          this.notificationService.showError('Error', 'Failed to update prompt.');
          this.loading = false;
        }
      });
    }
  }

  deletePrompt(prompt: Prompt): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${prompt.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.promptService.deletePrompt(prompt.id!).subscribe({
          next: () => {
            this.prompts = this.prompts.filter(p => p.id !== prompt.id);
            this.notificationService.showSuccess('Success', `Prompt ${prompt.name} deleted successfully.`);
          },
          error: (err) => {
            console.error('Error deleting prompt', err);
            this.notificationService.showError('Error', `Failed to delete prompt ${prompt.name}.`);
          }
        });
      }
    });
  }

  deleteSelectedPrompts(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected prompts?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const selectedIds = this.selectedPrompts.map(prompt => prompt.id!);
        forkJoin(selectedIds.map(id => this.promptService.deletePrompt(id))).subscribe({
          next: () => {
            this.prompts = this.prompts.filter(p => !selectedIds.includes(p.id!));
            this.notificationService.showSuccess('Success', 'Selected prompts deleted successfully.');
            this.selectedPrompts = [];
          },
          error: (err) => {
            console.error('Error deleting prompts', err);
            this.notificationService.showError('Error', 'Failed to delete some prompts.');
          }
        });
      }
    });
  }

  hideDialog() {
    this.viewDialog = false;
    this.addDialog = false;
    this.editDialog = false;
    this.loadPrompts(0, this.rows);
  }

  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    if (this.dt) {
      this.dt.filterGlobal(target.value, 'contains');
    }
  }

  loadTypesAndSubtypes() {
    this.promptService.getTypesAndSubtypes().subscribe({
      next: (data: TypesAndSubtypesResponse) => {
        this.types = Object.keys(data.types);
      },
      error: (err) => {
        console.error('Error fetching types and subtypes', err);
        this.notificationService.showError('Error', 'Failed to fetch types and subtypes.');
      }
    });
  }

  loadSubtypes(type: string) {
    this.subtypes = [];
    this.promptService.getTypesAndSubtypes().subscribe({
      next: (data: TypesAndSubtypesResponse) => {
        this.subtypes = data.types[type] || [];
      },
      error: (err) => {
        console.error('Error fetching subtypes', err);
        this.notificationService.showError('Error', 'Failed to fetch subtypes.');
      }
    });
  }

  loadPlaceholders(type: string) {
    this.placeholders = [];
    this.promptService.getPlaceholdersByType(type).subscribe({
      next: (data) => {
        this.placeholders = data;
      },
      error: (err) => {
        console.error('Error fetching placeholders', err);
        this.notificationService.showError('Error', 'Failed to fetch placeholders.');
      }
    });
  }

  addPlaceholderToEditor(placeholder: string, editorType: string) {
    let quillEditor: any;
  
    if (editorType === 'add' && this.editorAdd) {
      quillEditor = this.editorAdd.getQuill();
    } else if (editorType === 'edit' && this.editorEdit) {
      quillEditor = this.editorEdit.getQuill();
    }

    if (quillEditor) {
      const currentText = quillEditor.getText();
      quillEditor.setText(currentText.trimEnd() + ` ${placeholder} `); 
    }
  }

  private isValidPrompt(prompt: Prompt): boolean {
    return !!prompt.name && !!prompt.type && !!prompt.subtype && !!prompt.text && 
    prompt.text.includes("{output}");
  }
}
