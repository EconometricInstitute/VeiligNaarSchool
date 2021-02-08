import XLSX from 'xlsx';
import {PREFIX} from './parameters';
import utils from './utils';

const OVERLAP_SHEET = 'Overlap';
const GROUP_SHEET = 'Groups';

function writeSheet(groups, rawGroups, matrix, filename) {
    const n = groups.length;
    const o_sheet = {};
    o_sheet['A1'] = {t: 's', v: 'Groepen Paar'};
    o_sheet['C1'] = {t: 's', v: 'Overlap'};
    o_sheet['!merges'] = [{s:{r:0,c:0},e:{r:0,c:1}}];
    o_sheet['!ref'] = 'A1:C'+(1+(n*(n-1))/2);
    let r = 1;
    for (let i=0; i < n; i++) {
        for (let j=0; j < i; j++) {
            if (groups[i].originalIndex != groups[j].originalIndex) {
                const fromAddress = XLSX.utils.encode_cell({r, c: 0});
                const toAddress = XLSX.utils.encode_cell({r, c:1});
                const valueAddress = XLSX.utils.encode_cell({r, c:2});
                o_sheet[fromAddress] = {t: 's', v: groups[i].short};
                o_sheet[toAddress] = {t: 's', v: groups[j].short};
                o_sheet[valueAddress] = {t: 'n', v: matrix[i][j]};
                r++;
            }
        }
    }

    const g_sheet = {};
    g_sheet['A1'] = {t: 's', v: 'Groep'};
    g_sheet['B1'] = {t: 's', v: 'Splitsen'};
    g_sheet['!ref'] = 'A1:B'+(rawGroups.length+2);
    for (let i=0; i < rawGroups.length; i++) {
        const row = i+2;
        const grp = rawGroups[i];
        g_sheet['A'+row] = {t: 's', v: grp.short};
        g_sheet['B'+row] = {t: 'n', v: grp.split};
    }
    const Sheets = {};
    Sheets[OVERLAP_SHEET] = o_sheet;
    Sheets[GROUP_SHEET] = g_sheet;
    const book = {SheetNames: [OVERLAP_SHEET, GROUP_SHEET], Sheets};
    XLSX.writeFile(book, filename);
}

function readSheet(workbook) {
    const sheet = workbook.Sheets[OVERLAP_SHEET];
    if (!sheet) {
        throw 'Geen sheet met naam '+OVERLAP_SHEET+' beschikbaar.';
    }
    const range = XLSX.utils.decode_range(sheet['!ref']);
    let raw_groups = [];
    const g_sheet = workbook.Sheets[GROUP_SHEET];
    if (g_sheet) {
        const g_range = XLSX.utils.decode_range(g_sheet['!ref']);
        for (let r=1; r <= g_range.e.r; r++) {
            const c1 = g_sheet['A'+(r+1)];
            const c2 = g_sheet['B'+(r+1)];
            if (c1 && c1.v && c2 && Number.isInteger(c2.v) && c2.v >= 1) {
                const grp = {short: c1.v, full: PREFIX+c1.v, split: c2.v};
                raw_groups.push(grp);
            }
        }
    }
    else {
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
        raw_groups = [...groupSet.values()].sort().map(n => ({short: n, full: PREFIX+n, split: 1}));
    }
    const groups = utils.compute_groupview(raw_groups);
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
    return {groups: raw_groups, matrix};
}

export default {writeSheet, readSheet};