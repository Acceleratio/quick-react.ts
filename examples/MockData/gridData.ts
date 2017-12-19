import { GridColumn, DataTypeEnum, SortDirection } from '../../src/components/QuickGrid/QuickGrid.Props';

const RANDOM_WORDS = ['abstrusity', 'advertisable', 'bellwood', 'benzole', 'disputative', 'djilas', 'ebracteate', 'zonary'];
const RANDOM_Names = ['Ivan', 'Mario', 'Silvio', 'Hrvoje', 'Vinko', 'Marijana', 'Andrea'];
const RANDOM_Color = ['Black', 'Green', 'White', 'Blue', 'Orange', 'Red', 'Yellow', 'Gray'];
const RANDOM_Animal = ['Dog', 'Cat', 'Mouse'];
const RANDOM_City = ['Zagreb', 'Vienna', 'London', 'Amsterdam', 'Barcelona'];
const RANDOM_CarBrand = ['Audi', 'BMW', 'Mercedes', 'Opel', 'VW', 'Lada', 'Ford', 'Mazda'];
const RANDOM_Mix = ['1', 2, '3', 4, 'A', 'B', 'C', '10'];

export interface GridData1 {
    Test: string;
    Name: string;
    Color: string;
    Animal: string;
    Mixed: string | number;
    Numbers: number;
}

export interface TreeEntry {   
    ID: string; 
    leaves: Array<TreeEntry>;
    gridData: GridData1;
}

const resultich = [];

const pad = (num, size) => {
    let s = '000000000000000' + num;
    return s.substr(s.length - size);
};

const testarosa = () => {
    if (!this.resultich || this.resultich.length === 0) {
    let randomLower = (str : string) => Math.random() > 0.5 ? str : str.toLowerCase();
    const entry = (id): GridData1 => {
        return {
            Test: id,
            Name: RANDOM_Names[Math.floor(Math.random() * RANDOM_Names.length)],
            Color:  randomLower(RANDOM_Color[Math.floor(Math.random() * RANDOM_Color.length)]),
            Animal: RANDOM_Animal[Math.floor(Math.random() * RANDOM_Animal.length)],
            Mixed: RANDOM_Mix[Math.floor(Math.random() * RANDOM_Mix.length)],
            Numbers: Math.floor(Math.random() * 30)
        };
    };
    let test = 0;
    let result: Array<TreeEntry> = [];
    for (let i = 0; i < 15; i++) {
        const id1 = pad(i, 7);
        const gridData1 = entry('');
        let fistLevelChildren: Array<TreeEntry> = [];
        for (let j = 0; j < 30; j++) {
            const id2 = pad(i, 7) + '.' + pad(j, 7);
            const gridData2 = entry(id1);
            let secondLevelChildren: Array<TreeEntry> = [];
            for (let k = 0; k < 45; k++) {
                const id3 = pad(i, 7) + '.' + pad(j, 7) + '.' + pad(k, 7);
                const gridData3 = entry(id2);
                const thirdTreeEntry: TreeEntry = {ID: id2, leaves: [], gridData: gridData3};
                secondLevelChildren.push(thirdTreeEntry);             
            }
            const secondTreeEntry: TreeEntry = {ID: id1, leaves: secondLevelChildren, gridData: gridData2};
            fistLevelChildren.push(secondTreeEntry);            
        }
        const firstTreeEnty: TreeEntry = {ID: '', leaves: fistLevelChildren, gridData: gridData1};
        result.push(firstTreeEnty);
    }
    this.resultich = result;
    }
    return this.resultich;
};

const flatten = (data) => {
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

export const sortData = (sortColumn: string, sortDirection: SortDirection) => {
    const mirko = testarosa();
    const noviMirko = sortTree(mirko, sortColumn, sortDirection);
    const marko = flatten(noviMirko);
    return marko;
};

const sortTree = (tree: Array<TreeEntry>, sortColumn: string, sortDirection: SortDirection): Array<TreeEntry> => {
    let newTree: Array<TreeEntry> = [];
    for (let leaf of tree) {        
        if (leaf.leaves && leaf.leaves.length > 0) {
            leaf.leaves = sortTree(leaf.leaves, sortColumn, sortDirection);
        }
        newTree = sort([...tree], sortDirection, sortColumn);
    }
    return newTree;
};

const sort = (input, sortDirection, sortColumn) => {
    const sortModifier = sortDirection === SortDirection.Descending ? -1 : 1;
    const sortFunction = (a, b) => {
            let valueA = a.gridData[sortColumn];
            let valueB = b.gridData[sortColumn];
            if (valueA < valueB) {
                return -1 * sortModifier;
            }
            if (valueA > valueB) {
                return 1 * sortModifier;
            }        
        return 0;
    };
    return [...input].sort(sortFunction);
};


export const gridColumns1: Array<GridColumn> = [
    {
        dataType: DataTypeEnum.String,
        valueMember: 'Test',
        headerText: 'test',
        width: 0
    },
    // {
    //     dataType: DataTypeEnum.String,
    //     valueMember: 'Parent',
    //     headerText: 'Parent',
    //     width: 100
    // },
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



export function getGridData1(numberOfElements) {
    let data = [];
    const mirko = testarosa();
    const marko = flatten(mirko);
    return { tree: mirko, grid: marko };
    // for (let i = 0; i < numberOfElements; i++) {
    //     let randomLower = (str : string) => Math.random() > 0.5 ? str : str.toLowerCase();
    //     let test = '';
    //     let parent = '';
    //     const res = i % 7;
    //     if (res === 0) {
    //         test = pad(Math.floor(i / 7), 7);
    //         parent = '';
    //     } else if (res === 1 || res === 3) {
    //         const sufix = res === 1 ? pad(0, 7) : pad(1, 7);
    //         parent = pad(Math.floor(i / 7), 7);
    //         test =  parent + '.' + sufix; 
    //     } else {
    //         const sufix2 = res < 3 ? pad(0, 7) : pad(1, 7);
    //         parent = pad(Math.floor(i / 7), 7) + '.' + sufix2;                 
    //         const sufix3 = res < 3 ? pad(0, 7) : pad((i - 4) % 4, 7);     
    //         test = parent + '.' + sufix3;
    //     }
    //     data.push(
    //         {
    //             Test: test,
    //             // Parent: parent,
    //             Name: RANDOM_Names[Math.floor(Math.random() * RANDOM_Names.length)],
    //             Color:  randomLower(RANDOM_Color[Math.floor(Math.random() * RANDOM_Color.length)]),
    //             Animal: RANDOM_Animal[Math.floor(Math.random() * RANDOM_Animal.length)],
    //             Mixed: RANDOM_Mix[Math.floor(Math.random() * RANDOM_Mix.length)],
    //             Numbers: Math.floor(Math.random() * 30),
    //             Order: i
    //         }
    //     );
    // }
    // return data;
}


export interface GridData2 {
    Name: string;
    Color: string;
}

export const gridColumns2: Array<GridColumn> = [
    {
        valueMember: 'RandomWords',
        headerText: 'Random Words',
        width: 100
    }, {
        valueMember: 'Color',
        headerText: 'Color',
        width: 100
    }
];

export function getGridData2(numberOfElements): Array<GridData2> {
    let data = [];
    for (let i = 0; i < numberOfElements; i++) {
        data.push(
            {
                RandomWords: RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)],
                Color: RANDOM_Color[Math.floor(Math.random() * RANDOM_Color.length)]
            }
        );
    }
    return data;
}
