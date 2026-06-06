import { HttpContextToken } from '@angular/common/http';

export const SKIP_ERROR_HANDLING = new HttpContextToken<boolean>(() => false);
