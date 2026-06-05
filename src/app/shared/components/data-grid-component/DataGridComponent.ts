import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridConfig } from '../../interfaces/grid-config'
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss']
})
export class DataGridComponent {

  @Input() config!: GridConfig;
  @Input() data: any[] = [];
  @Input() totalCount = 0;

  @Output() search = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();
  @Output() pageChange = new EventEmitter<number>();

  private searchSubject = new Subject<string>();

  currentPage = 1;

  public sortColumn = '';
  public sortDirection: 'asc' | 'desc' = 'asc';

  constructor() {

    this.searchSubject.pipe(
      debounceTime(400),        // ⏱ wait 400ms after typing stops
      distinctUntilChanged()    // 🚫 ignore same value repeats
    ).subscribe(value => {
      this.search.emit(value);
    });

  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  sort(column: string) {

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortChange.emit({
      column: this.sortColumn,
      direction: this.sortDirection
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.pageChange.emit(page);
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / (this.config.pageSize || 10));
  }

  get startRecord(): number {
    const pageSize = this.config?.pageSize ?? 10;

    return this.totalCount === 0
      ? 0
      : ((this.currentPage - 1) * pageSize) + 1;
  }

  get endRecord(): number {
    const pageSize = this.config?.pageSize ?? 10;

    return Math.min(
      this.currentPage * pageSize,
      this.totalCount ?? 0
    );
  }

  pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
}
