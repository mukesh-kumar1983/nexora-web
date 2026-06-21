import { Injectable } from '@angular/core';
import { APP_MENU } from '../constants/app-menu';
import { UserContextService } from './user-context.service';
import { MenuItem } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private userContext: UserContextService) { }

  getMenu(): MenuItem[] {
    const user = this.userContext.getUser();

    if (!user) return [];

    return APP_MENU
      .map(item => this.filterItem(item, user.roles))
      .filter(item => item !== null) as MenuItem[];
  }

  private filterItem(item: MenuItem, roles: string[]): MenuItem | null {

    const hasAccess =
      !item.roles ||
      item.roles.some(r => roles.includes(r));

    if (!hasAccess) return null;

    if (item.children) {
      const children = item.children
        .map(child => this.filterItem(child, roles))
        .filter(c => c !== null) as MenuItem[];

      return { ...item, children };
    }

    return item;
  }
}
