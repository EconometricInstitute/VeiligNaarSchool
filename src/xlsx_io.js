import XLSX from 'xlsx';
import {PREFIX} from './parameters';

const SHEET_NAME = 'Overlap';

function writeSheet(groups, matrix, filename) {
    const n = groups.length;
    const sheet = {};
    sheet['A1'] = {t: 's', v: 'Groepen Paar'};
    sheet['C1'] = {t: 's', v: 'Overlap'};
    sheet['!merges'] = [{s:{r:0,c:0},e:{r:0,c:1}}];
    sheet['!ref'] = 'A'+1+':C'+(1+(n*(n-1))/2);
    let r = 1;
    for (let i=0; i < n; i++) {
        for (let j=0; j < i; j++) {
            const fromAddress = XLSX.utils.encode_cell({r, c: 0});
            const toAddress = XLSX.utils.encode_cell({r, c:1});
            const valueAddress = XLSX.utils.encode_cell({r, c:2});
            sheet[fromAddress] = {t: 's', v: groups[i].short};
            sheet[toAddress] = {t: 's', v: groups[j].short};
            sheet[valueAddress] = {t: 'n', v: matrix[i][j]};
            r++;
        }
    }
    const book = {SheetNames: [SHEET_NAME], Sheets: {SHEET_NAME: sheet}};
    XLSX.writeFile(book, filename);
}

function readSheet(workbook) {
    const sheet = workbook.Sheets[SHEET_NAME];
    if (!sheet) {
        throw 'Geen sheet met naam '+SHEET_NAME+' beschikbaar.';
    }
    const range = XLSX.utils.decode_range(sheet['!ref']);
    const groupSet = new Set();
    for (let r=1; r <= range.e.r; r++) {
        const address1 = XLSX.utils.encode_cell({r, c: 0});
        const address2 = XLSX.utils.encode_cell({r, c: 1});
        const c1 = sheet[address1];
        const c2 = sheet[address2];
        if (c1 && c1.v && c1.v.trim() != '') {
            groupSet.add(c1.v.trim());
        }
        if (c2 && c2.v && c2.v.trim() != '') {
            groupSet.add(c2.v.trim());
        }
    }
    const groups = [...groupSet.values()].sort().map(n => ({short: n, full: PREFIX+n}));
    const groupIdx = {};
    for (let [idx, grp] of groups.entries()) {
        groupIdx[grp.short] = idx;
    }
    const matrix = [];
    for (let i=0; i < groups.length; i++) {
        const row = [];
        for (let j=0; j < groups.length; j++) {
            row.push(0);
        }
        matrix.push(row);
    }
    for (let r=1; r <= range.e.r; r++) {
        const address1 = XLSX.utils.encode_cell({r, c: 0});
        const address2 = XLSX.utils.encode_cell({r, c: 1});
        const address3 = XLSX.utils.encode_cell({r, c: 2});
        const c1 = sheet[address1];
        const c2 = sheet[address2];
        const c3 = sheet[address3];
        if (c1 && c2 && c3 && c1.v && c2.v && c3.v && c1.v.trim() != '' && c2.v.trim() != '') {
            const grp1 = c1.v.trim();
            const grp2 = c2.v.trim();
            const overlap = c3.v;
            const idx1 = groupIdx[grp1];
            const idx2 = groupIdx[grp2];
            matrix[idx1][idx2] = overlap;
            matrix[idx2][idx1] = overlap;
        }
    }    
    return {groups, matrix};
}

export default {writeSheet, readSheet};