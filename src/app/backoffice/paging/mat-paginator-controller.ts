import { MatPaginatorIntl } from '@angular/material';

export class MatPaginatorController extends MatPaginatorIntl {
    // 設定其他顯示資訊文字
    itemsPerPageLabel = '每頁筆數：';
    nextPageLabel = '下一頁';
    previousPageLabel = '上一頁';

    // 設定顯示筆數資訊文字
    getRangeLabel = (page: number, pageSize: number, length: number): string => {
        if (length === 0 || pageSize === 0) {
            return `第 0 筆、共 ${length} 筆`;
        }

        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

        return `第 ${startIndex + 1} - ${endIndex} 筆、共 ${length} 筆`;
    }
}
