import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { MenuItem } from '../../../core/models/menu.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  menu: MenuItem[] = [];

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
    this.menu = this.menuService.getMenu();
  }
}



//=============================OLD STATIC MENU======================
//import { Component, EventEmitter, Output } from '@angular/core';
//import { CommonModule } from '@angular/common';
//import { RouterModule } from '@angular/router';

//@Component({
//  selector: 'app-sidebar',
//  standalone: true,
//  imports: [CommonModule, RouterModule],
//  templateUrl: './sidebar.component.html',
//  styleUrls: ['./sidebar.component.scss']
//})
//export class SidebarComponent {

//  isCollapsed = false;

//  // ✅ FIX: required for tooltip system
//  activeTooltip: string | null = null;

//  @Output() collapsedChange = new EventEmitter<boolean>();

//  toggleSidebar(): void {
//    this.isCollapsed = !this.isCollapsed;

//    this.collapsedChange.emit(this.isCollapsed);
//  }

//  // ✅ Tooltip handlers
//  setTooltip(name: string): void {
//    if (this.isCollapsed) {
//      this.activeTooltip = name;
//    }
//  }

//  clearTooltip(): void {
//    this.activeTooltip = null;
//  }
//}
