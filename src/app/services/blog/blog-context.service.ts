import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogContextService {
  private _activeBlogId = new BehaviorSubject<number | null>(null);
  activeBlogId$ = this._activeBlogId.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const storedId = sessionStorage.getItem('active_blog_id');
      if (storedId) {
        this._activeBlogId.next(+storedId);
      }
    }
  }

  setActiveBlogId(blogId: number) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('active_blog_id', blogId.toString());
    }
    this._activeBlogId.next(blogId);
  }

  clearActiveBlogId() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('active_blog_id');
    }
    this._activeBlogId.next(null);
  }
}
