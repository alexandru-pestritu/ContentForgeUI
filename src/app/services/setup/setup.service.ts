import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { SetupStatus } from '../../models/setup-status/setup-status';
import { Observable } from 'rxjs';
import { UserCreate } from '../../models/user/user-create';
import { Blog } from '../../models/blog/blog';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  private endpoint = 'setup';

  constructor(private httpService: HttpService) {}

  getSetupStatus(): Observable<SetupStatus> {
    return this.httpService.get<SetupStatus>(`${this.endpoint}/status`);
  }

  setupStep1User(userData: UserCreate): Observable<any> {
    return this.httpService.post<any>(`${this.endpoint}/step1`, userData);
  }

  setupStep2ApiKeys(
    crawlbaseApiKey: string,
    scrapingfishApiKey: string,
    edenaiApiKey: string
  ): Observable<any> {

    return this.httpService.post<any>(`${this.endpoint}/step2?crawlbase_api_key=${crawlbaseApiKey}&scrapingfish_api_key=${scrapingfishApiKey}&edenai_api_key=${edenaiApiKey}`, {});
  }

  setupStep3FirstBlog(blogData: Partial<Blog>): Observable<any> {
    return this.httpService.post<any>(`${this.endpoint}/step3`, blogData);
  }


  finalizeSetup(): Observable<SetupStatus> {
    return this.httpService.post<SetupStatus>(`${this.endpoint}/complete`, {});
  }
}
