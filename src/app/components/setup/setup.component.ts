import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupStatus } from '../../models/setup-status/setup-status';
import { SetupService } from '../../services/setup/setup.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification/notification.service';
import { Blog } from '../../models/blog/blog';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss'
})
export class SetupComponent {
  step1Form!: FormGroup;
  step2Form!: FormGroup;
  step3Form!: FormGroup;

  activeStepIndex = 0;
  setupStatus?: SetupStatus;

  constructor(
    private fb: FormBuilder,
    private setupService: SetupService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.step1Form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.step2Form = this.fb.group({
      crawlbaseApiKey: ['', Validators.required],
      scrapingfishApiKey: ['', Validators.required],
      edenaiApiKey: ['', Validators.required]
    });

    this.step3Form = this.fb.group({
      name: ['', Validators.required],
      base_url: ['', Validators.required],
      username: ['', Validators.required],
      api_key: ['', Validators.required],
      logo_url: ['']
    });

    this.setupService.getSetupStatus().subscribe({
      next: (status) => {
        this.setupStatus = status;
        this.activeStepIndex = (status.current_step - 1 >= 0) ? status.current_step - 1 : 0;
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to fetch setup status.');
      }
    });
  }

  onStepChange(event: any) {
    this.activeStepIndex = event.index;
  }

  onSubmitStep1() {
    if (this.step1Form.invalid) return;
    const { name, email, password } = this.step1Form.value;

    this.setupService.setupStep1User({ name, email, password }).subscribe({
      next: (resp) => {
        this.activeStepIndex = 1;
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to create user.');
      }
    });
  }

  onSubmitStep2() {
    if (this.step2Form.invalid) return;
    const { crawlbaseApiKey, scrapingfishApiKey, edenaiApiKey } = this.step2Form.value;

    this.setupService.setupStep2ApiKeys(crawlbaseApiKey, scrapingfishApiKey, edenaiApiKey).subscribe({
      next: (resp) => {
        this.activeStepIndex = 2;
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to save API keys.');
      }
    });
  }

  onSubmitStep3() {
    if (this.step3Form.invalid) return;

    const data: Partial<Blog> = this.step3Form.value;

    this.setupService.setupStep3FirstBlog(data).subscribe({
      next: (resp) => {
        this.finalizeSetup();
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to create blog.');
      }
    });
}

  finalizeSetup() {
    this.setupService.finalizeSetup().subscribe({
      next: (status) => {
        this.router.navigate(['/blogs']);
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to finalize setup.');
      }
    });
  }
}

