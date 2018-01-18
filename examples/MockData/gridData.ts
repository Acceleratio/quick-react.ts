import { GridColumn, DataTypeEnum, SortDirection } from '../../src/components/QuickGrid/QuickGrid.Props';
import { TreeNode } from '../../src/components/TreeGrid/TreeGrid.Props';


const RANDOM_WORDS = ['abstrusity', 'advertisable', 'bellwood', 'benzole', 'disputative', 'djilas', 'ebracteate', 'zonary'];
const RANDOM_Names = ['Ivan', 'Mario', 'Silvio', 'Hrvoje', 'Vinko', 'Marijana', 'Andrea'];
const RANDOM_Color = ['Black', 'Green', 'White', 'Blue', 'Orange', 'Red', 'Yellow', 'Gray'];
const RANDOM_Animal = ['Dog', 'Cat', 'Mouse'];
const RANDOM_City = ['Zagreb', 'Vienna', 'London', 'Amsterdam', 'Barcelona'];
const RANDOM_CarBrand = ['Audi', 'BMW', 'Mercedes', 'Opel', 'VW', 'Lada', 'Ford', 'Mazda'];
const RANDOM_Mix = ['1', 2, '3', 4, 'A', 'B', 'C', '10'];

export interface GridData extends TreeNode {
    Name: string;
    Color: string;
    Animal: string;
    Mixed: string | number;
    Numbers: number;
}

let totalItems = 0;
const generateTreeData = (size: number): TreeNode => {
    let treeSize: Array<number>;
    if (size === 0) {
        treeSize = [5, 5, 5, 2];
    } else {
        treeSize = [10, 1000, 5, 10];
    }
    let result: Array<TreeNode> = [];
    let randomLower = (str : string) => Math.random() > 0.5 ? str : str.toLowerCase();

    const generateEntry = (id: string, parent: string): GridData => {
        totalItems++;
        return {
            treeId: id,
            parentId: parent,
            isExpanded: true,
            children: [],
            Name: RANDOM_Names[Math.floor(Math.random() * RANDOM_Names.length)] + Math.random() * 100,
            Color:  randomLower(RANDOM_Color[Math.floor(Math.random() * RANDOM_Color.length)]),
            Animal: RANDOM_Animal[Math.floor(Math.random() * RANDOM_Animal.length)],
            Mixed: RANDOM_Mix[Math.floor(Math.random() * RANDOM_Mix.length)],
            Numbers: Math.floor(Math.random() * 30)

        };
    };

    for (let i = 0; i < treeSize[0]; i++) {
        let treeEntry = generateEntry(i + '.', null);
        for (let j = 0; j < treeSize[1]; j++) {
            let treeEntry1 = generateEntry(treeEntry.treeId + j + '.', treeEntry.treeId);
            for (let k = 0; k < treeSize[2]; k++) {
                let treeEntry2 = generateEntry(treeEntry1.treeId + k + '.', treeEntry1.treeId);
                for (let l = 0; l < treeSize[3]; l++) {
                    let treeEntry3 = generateEntry(treeEntry2.treeId + l + '.', treeEntry2.treeId);
                    // treeEntry3.isExpanded = false;
                    treeEntry2.children.push(treeEntry3);
                }
                // treeEntry2.isExpanded = false;
                treeEntry1.children.push(treeEntry2);
            }
            treeEntry.children.push(treeEntry1);
        }
        result.push(treeEntry);
    }
    // alert(totalItems);
    return {
        treeId: '',
        parentId: '',
        children: result
    };
};

export const gridColumns1: Array<GridColumn> = [
    {
        valueMember: 'Name',
        headerText: 'Name',
        width: 100,
        minWidth: 100,
        headerTooltip: 'This is names column.'
    }, 
    {
        dataType: DataTypeEnum.String,
        valueMember: 'Color',
        headerText: 'Color',
        width: 100
    }, 
    {
        valueMember: 'Animal',
        headerText: 'Animal - with very long header name',
        width: 100
    }, 
    {
        valueMember: 'Mixed',
        headerText: 'Numbers and strings',
        width: 100
    }, 
    {
        valueMember: 'Numbers',
        headerText: 'Numbers',
        width: 100
    }
];



export function getTreeGridData(size: number) {
    const treeData = generateTreeData(size);
    return treeData;
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

export const gridColumns3: Array<GridColumn> = [
    {
        valueMember: 'Animal',
        headerText: 'Animal - with very long header name',
        width: 100
    }, {
        valueMember: 'Color',
        headerText: 'Color',
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

export function getSmallGridData(numberOfElements) {
    let data = [];
    for (let i = 0; i < numberOfElements; i++) {
        data.push(
            {
                Animal: RANDOM_Animal[Math.floor(Math.random() * RANDOM_Animal.length)],
                Color:  RANDOM_Color[Math.floor(Math.random() * RANDOM_Color.length)]
            }
        );
    }
    return { grid: data };
}
