import { GridColumn, DataTypeEnum, SortDirection, TreeEntry, GridData } from '../../src/components/QuickGrid/QuickGrid.Props';

const RANDOM_WORDS = ['abstrusity', 'advertisable', 'bellwood', 'benzole', 'disputative', 'djilas', 'ebracteate', 'zonary'];
const RANDOM_Names = ['Ivan', 'Mario', 'Silvio', 'Hrvoje', 'Vinko', 'Marijana', 'Andrea'];
const RANDOM_Color = ['Black', 'Green', 'White', 'Blue', 'Orange', 'Red', 'Yellow', 'Gray'];
const RANDOM_Animal = ['Dog', 'Cat', 'Mouse'];
const RANDOM_City = ['Zagreb', 'Vienna', 'London', 'Amsterdam', 'Barcelona'];
const RANDOM_CarBrand = ['Audi', 'BMW', 'Mercedes', 'Opel', 'VW', 'Lada', 'Ford', 'Mazda'];
const RANDOM_Mix = ['1', 2, '3', 4, 'A', 'B', 'C', '10'];

// export interface GridData {
//     TreeId: string;
//     Name: string;
//     Color: string;
//     Animal: string;
//     Mixed: string | number;
//     Numbers: number;
// }
export interface GridDataFull extends GridData {
    Name: string;
    Color: string;
    Animal: string;
    Mixed: string | number;
    Numbers: number;
}

const testResult: Array<TreeEntry> = [];

const generateTreeData = (): TreeEntry[] => {
    let treeEntryGrid = this.TreeEntryGrid;
    if (!this.testResult || this.testResult.length === 0) {
    let randomLower = (str : string) => Math.random() > 0.5 ? str : str.toLowerCase();
    const entry = (id): GridDataFull => {
        return {
            TreeId: id,
            IsExpanded: true,
            Name: RANDOM_Names[Math.floor(Math.random() * RANDOM_Names.length)],
            Color:  randomLower(RANDOM_Color[Math.floor(Math.random() * RANDOM_Color.length)]),
            Animal: RANDOM_Animal[Math.floor(Math.random() * RANDOM_Animal.length)],
            Mixed: RANDOM_Mix[Math.floor(Math.random() * RANDOM_Mix.length)],
            Numbers: Math.floor(Math.random() * 30)

        };
    };
    let result: Array<TreeEntry> = [];
    for (let i = 0; i < 15; i++) {
        const id1 = String(i);
        const gridData1 = entry(id1);
        let firstLevelChildren: Array<TreeEntry> = [];
        for (let j = 0; j < 30; j++) {
            const id2 = i + '.' + j;
            const gridData2 = entry(id2);
            let secondLevelChildren: Array<TreeEntry> = [];
            for (let k = 0; k < 45; k++) {
                const id3 = i + '.' + j + '.' + k;
                const gridData3 = entry(id3);
                const thirdTreeEntry: TreeEntry = {ID: id2, leaves: [], gridData: gridData3};
                secondLevelChildren.push(thirdTreeEntry);             
            }
            const secondTreeEntry: TreeEntry = {ID: id1, leaves: secondLevelChildren, gridData: gridData2};
            firstLevelChildren.push(secondTreeEntry);            
        }
        const firstTreeEntry: TreeEntry = {ID: '', leaves: firstLevelChildren, gridData: gridData1};
        result.push(firstTreeEntry);
    }
    this.testResult = result;
    }
    return this.testResult;
};

export const gridColumns1: Array<GridColumn> = [
    {
        dataType: DataTypeEnum.String,
        valueMember: 'TreeId',
        headerText: 'TreeId',
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
    const treeData = generateTreeData();
    const gridData = flatten(treeData);
    return { tree: treeData, grid: gridData };
}


const flatten = (data): Array<GridData> => {
    let result = [];      
    for (let leaf of data) {
        result.push(leaf.gridData);
        if (leaf.children && leaf.children.length > 0) {
            const childrenRows = flatten(leaf.children);
            result = result.concat(childrenRows);
        }
    }
    return result;      
};



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
