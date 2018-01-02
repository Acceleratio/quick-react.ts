import { GridColumn, DataTypeEnum, SortDirection, TreeEntry } from '../../src/components/QuickGrid/QuickGrid.Props';
import { flattenTree } from '../../src/components/QuickGrid/TreeGridDataSelectors';

const RANDOM_WORDS = ['abstrusity', 'advertisable', 'bellwood', 'benzole', 'disputative', 'djilas', 'ebracteate', 'zonary'];
const RANDOM_Names = ['Ivan', 'Mario', 'Silvio', 'Hrvoje', 'Vinko', 'Marijana', 'Andrea'];
const RANDOM_Color = ['Black', 'Green', 'White', 'Blue', 'Orange', 'Red', 'Yellow', 'Gray'];
const RANDOM_Animal = ['Dog', 'Cat', 'Mouse'];
const RANDOM_City = ['Zagreb', 'Vienna', 'London', 'Amsterdam', 'Barcelona'];
const RANDOM_CarBrand = ['Audi', 'BMW', 'Mercedes', 'Opel', 'VW', 'Lada', 'Ford', 'Mazda'];
const RANDOM_Mix = ['1', 2, '3', 4, 'A', 'B', 'C', '10'];

export interface GridData {
    Test: string;
    Name: string;
    Color: string;
    Animal: string;
    Mixed: string | number;
    Numbers: number;
}

const testResult: Array<TreeEntryGrid> = [];
interface TreeEntryGrid extends TreeEntry<GridData> {}


const generateTreeData = () => {
    let treeEntryGrid = this.TreeEntryGrid;
    if (!this.testResult || this.testResult.length === 0) {
    let randomLower = (str : string) => Math.random() > 0.5 ? str : str.toLowerCase();
    const entry = (id): GridData => {
        return {
            Test: id,
            Name: RANDOM_Names[Math.floor(Math.random() * RANDOM_Names.length)],
            Color:  randomLower(RANDOM_Color[Math.floor(Math.random() * RANDOM_Color.length)]),
            Animal: RANDOM_Animal[Math.floor(Math.random() * RANDOM_Animal.length)],
            Mixed: RANDOM_Mix[Math.floor(Math.random() * RANDOM_Mix.length)],
            Numbers: Math.floor(Math.random() * 30)
        };
    };
    let result: Array<TreeEntryGrid> = [];
    for (let i = 0; i < 15; i++) {
        const id1 = String(i);
        const gridData1 = entry('');
        let firstLevelChildren: Array<TreeEntryGrid> = [];
        for (let j = 0; j < 30; j++) {
            const id2 = i + '.' + j;
            const gridData = entry(id1);
            let secondLevelChildren: Array<TreeEntryGrid> = [];
            for (let k = 0; k < 45; k++) {
                const id3 = i + '.' + j + '.' + k;
                const gridData3 = entry(id2);
                const thirdTreeEntry: TreeEntryGrid = {ID: id2, leaves: [], gridData: gridData3};
                secondLevelChildren.push(thirdTreeEntry);             
            }
            const secondTreeEntry: TreeEntryGrid = {ID: id1, leaves: secondLevelChildren, gridData: gridData};
            firstLevelChildren.push(secondTreeEntry);            
        }
        const firstTreeEnty: TreeEntryGrid = {ID: '', leaves: firstLevelChildren, gridData: gridData1};
        result.push(firstTreeEnty);
    }
    this.testResult = result;
    }
    return this.testResult;
};

export const gridColumns1: Array<GridColumn> = [
    {
        dataType: DataTypeEnum.String,
        valueMember: 'Test',
        headerText: 'test',
        width: 0
    },
    {
        valueMember: 'Name',
        headerText: 'Name',
        width: 100,
        headerTooltip: 'This is names column.'
    }, 
    {
        dataType: DataTypeEnum.String,
        valueMember: 'Color',
        headerText: 'Color',
        width: 100
    }, {
        valueMember: 'Animal',
        headerText: 'Animal - with very long header name',
        width: 100
    }, {
        valueMember: 'Mixed',
        headerText: 'Numbers and strings',
        width: 100
    }, {
        valueMember: 'Numbers',
        headerText: 'Numbers',
        width: 100
    }
];



export function getTreeGridData() {
    const treeData = generateTreeData() as Array<TreeEntryGrid>;
    const gridData = flattenTree(treeData);
    return { tree: treeData, grid: gridData };
}


// const flatten = (data) => {
//     let result = [];      
//     for (let leaf of data) {
//         result.push(leaf.gridData);
//         if (leaf.children && leaf.children.length > 0) {
//             const childrenRows = flatten(leaf.children);
//             result = result.concat(childrenRows);
//         }
//     }
//     return result;      
// };



export const gridColumns2: Array<GridColumn> = [
    {
        valueMember: 'RandomWords',
        headerText: 'Random Words',
        width: 100
    }, {
        valueMember: 'Color',
        headerText: 'Color',
        width: 100
    }, {
        valueMember: 'Animal',
        headerText: 'Animal - with very long header name',
        width: 100
    }, {
        valueMember: 'Mixed',
        headerText: 'Numbers and strings',
        width: 100
    }, {
        valueMember: 'Numbers',
        headerText: 'Numbers',
        width: 100
    }
];

export function getGridData(numberOfElements) {
    let data = [];
    for (let i = 0; i < numberOfElements; i++) {
        data.push(
            {
                RandomWords: RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)],
                Color:  RANDOM_Color[Math.floor(Math.random() * RANDOM_Color.length)],
                Animal: RANDOM_Animal[Math.floor(Math.random() * RANDOM_Animal.length)],
                Mixed: RANDOM_Mix[Math.floor(Math.random() * RANDOM_Mix.length)],
                Numbers: Math.floor(Math.random() * 30)
            }
        );
    }
    return { grid: data };
}
