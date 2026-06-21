import { GridColumn } from './grid-column';

export interface GridConfig {                    
  
  pageSize?: number;
  enableSearch?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  columns: GridColumn[];
}


//===========================OLD IMPLEMENTATION===========================
//import { GridColumn } from './grid-column';

//export interface GridConfig {
//  apiUrl: string;
//  pageSize?: number;
//  enableSearch?: boolean;
//  enablePagination?: boolean;
//  enableSorting?: boolean;
//  columns: GridColumn[];
//}
