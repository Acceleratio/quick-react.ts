import { GridColumn, DataTypeEnum, SortDirection, TreeNode } from '../../src/components/QuickGrid/QuickGrid.Props';


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

function flatten(tree): Array<TreeNode> {
    let result = [];      
    for (let leaf of tree) {
        result.push(leaf);
        if (leaf.leaves && leaf.leaves.length > 0) {
            const leaves = flatten(leaf.leaves);
            result = result.concat(leaves);
        }
    }
    return result;         
}


const generateTreeData = (): TreeNode[] => {
    let result: Array<TreeNode> = [];
    let randomLower = (str : string) => Math.random() > 0.5 ? str : str.toLowerCase();

    const generateEntry = (id: string, parent: string): GridData => {
        return {
            TreeId: id,
            Parent: parent,
            IsExpanded: true,
            leaves: [],
            Name: RANDOM_Names[Math.floor(Math.random() * RANDOM_Names.length)],
            Color:  randomLower(RANDOM_Color[Math.floor(Math.random() * RANDOM_Color.length)]),
            Animal: RANDOM_Animal[Math.floor(Math.random() * RANDOM_Animal.length)],
            Mixed: RANDOM_Mix[Math.floor(Math.random() * RANDOM_Mix.length)],
            Numbers: Math.floor(Math.random() * 30)

        };
    };
    for (let i = 0; i < 101; i++) {
        let treeEntry = generateEntry(i + '.', null);
        for (let j = 0; j < 20; j++) {
            let treeEntry1 = generateEntry(treeEntry.TreeId + j + '.', treeEntry.TreeId);
            for (let k = 0; k < 20; k++) {
                let treeEntry2 = generateEntry(treeEntry1.TreeId + k + '.', treeEntry1.TreeId);
                treeEntry1.leaves.push(treeEntry2);
            }
            treeEntry.leaves.push(treeEntry1);
        }
        result.push(treeEntry);
    }

    return result;
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



export function getTreeGridData() {
    const treeData = generateTreeData();
    const gridData = flatten(treeData);
    return { tree: treeData, grid: gridData };
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
