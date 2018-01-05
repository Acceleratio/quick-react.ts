import { GridColumn, DataTypeEnum, SortDirection, TreeEntry, TreeGridData } from '../../src/components/QuickGrid/QuickGrid.Props';


const RANDOM_WORDS = ['abstrusity', 'advertisable', 'bellwood', 'benzole', 'disputative', 'djilas', 'ebracteate', 'zonary'];
const RANDOM_Names = ['Ivan', 'Mario', 'Silvio', 'Hrvoje', 'Vinko', 'Marijana', 'Andrea'];
const RANDOM_Color = ['Black', 'Green', 'White', 'Blue', 'Orange', 'Red', 'Yellow', 'Gray'];
const RANDOM_Animal = ['Dog', 'Cat', 'Mouse'];
const RANDOM_City = ['Zagreb', 'Vienna', 'London', 'Amsterdam', 'Barcelona'];
const RANDOM_CarBrand = ['Audi', 'BMW', 'Mercedes', 'Opel', 'VW', 'Lada', 'Ford', 'Mazda'];
const RANDOM_Mix = ['1', 2, '3', 4, 'A', 'B', 'C', '10'];

export interface GridData extends TreeGridData {
    Name: string;
    Color: string;
    Animal: string;
    Mixed: string | number;
    Numbers: number;
}

function newTreeEntry(data: TreeGridData, parent: TreeEntry, id: number): TreeEntry {
    data.IsExpanded = true;
    data.TreeId = parent ? parent.gridData.TreeId + id + '.' : id + '.';
    // sta cemo s ovim id-em, potreban je da nadjemo njegovu djecu preko njega zbog startsWith
    // i ovaj parent ovdje uopce nije potreban ako ga samo za id koristimo
    return { gridData: data, leaves: [] };
}

function flatten(tree): Array<TreeGridData> {
    let result = [];      
    for (let leaf of tree) {
        result.push(leaf.gridData);
        if (leaf.leaves && leaf.leaves.length > 0) {
            const leaves = flatten(leaf.leaves);
            result = result.concat(leaves);
        }
    }
    return result;         
}


const generateTreeData = (): TreeEntry[] => {
    let result: Array<TreeEntry> = [];
    let randomLower = (str : string) => Math.random() > 0.5 ? str : str.toLowerCase();

    const generateEntry = (): GridData => {
        return {
            Name: RANDOM_Names[Math.floor(Math.random() * RANDOM_Names.length)],
            Color:  randomLower(RANDOM_Color[Math.floor(Math.random() * RANDOM_Color.length)]),
            Animal: RANDOM_Animal[Math.floor(Math.random() * RANDOM_Animal.length)],
            Mixed: RANDOM_Mix[Math.floor(Math.random() * RANDOM_Mix.length)],
            Numbers: Math.floor(Math.random() * 30)

        };
    };

    for (let i = 0; i < 110; i++) {
        let treeEntry = newTreeEntry(generateEntry(), null, i);
        for (let j = 0; j < 20; j++) {
            let treeEntry1 = newTreeEntry(generateEntry(), treeEntry, j);
            for (let k = 0; k < 20; k++) {
                let treeEntry2 = newTreeEntry(generateEntry(), treeEntry1, k);
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
