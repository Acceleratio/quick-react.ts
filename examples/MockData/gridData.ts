import { GridColumn, DataTypeEnum, SortDirection, BoolFormatTypeEnum, ActionItem } from '../../src/components/QuickGrid/QuickGrid.Props';
import { TreeNode, TreeDataSource } from '../../src/models/TreeData';

const RANDOM_WORDS = ['abstrusity', 'advertisable', 'bellwood', 'benzole', 'disputative', 'djilas', 'ebracteate', 'zonary'];
const RANDOM_Names = ['Ivan', 'Mario', 'Silvio', 'Hrvoje', 'Vinko', 'Marijana', 'Andrea'];
const RANDOM_Color = ['Black', 'Green', 'White', 'Blue', 'Orange', 'Red', 'Yellow', 'Gray'];
const RANDOM_Animal = ['Dog', 'Cat', 'Mouse'];
const RANDOM_City = ['Zagreb', 'Vienna', 'London', 'Amsterdam', 'Barcelona'];
const RANDOM_CarBrand = ['Audi', 'BMW', 'Mercedes', 'Opel', 'VW', 'Lada', 'Ford', 'Mazda'];
const RANDOM_Mix = ['1', 2, '3', 4, 'A', 'B', 'C', '10'];
const RANDOM_ActionIcons = ['svg-icon-add', 'svg-icon-camera', 'svg-icon-edit', 'svg-icon-open', 'svg-icon-settings', 'svg-icon-user', 'svg-icon-reset'];

export interface GridData {
    Name: string;
    Color: string;
    Animal: string;
    Mixed: string | number;
    Numbers: number;
    IsUpdated: boolean;
}

let totalItems = 0;

const randomLower = (str: string) => Math.random() > 0.5 ? str : str.toLowerCase();

export const nodeActions = [
    {
        name: 'Test Action 1',
        commandName: 'TestAction1',
        iconName: RANDOM_ActionIcons[Math.floor(Math.random() * RANDOM_ActionIcons.length)],
        showInDropdown: true
    },
    {
        name: 'Test Action 2',
        commandName: 'TestAction2',
        iconName: RANDOM_ActionIcons[Math.floor(Math.random() * RANDOM_ActionIcons.length)]
    },
    {
        name: 'Random Action ' + Math.floor(Math.random() * 10),
        commandName: 'Random Action 1',
        iconName: RANDOM_ActionIcons[Math.floor(Math.random() * RANDOM_ActionIcons.length)]
    },
    {
        name: 'Random Action ' + Math.floor(Math.random() * 10),
        commandName: 'Random Action 2',
        iconName: RANDOM_ActionIcons[Math.floor(Math.random() * RANDOM_ActionIcons.length)]
    }
];

export const generateTreeNode = () => {
    totalItems++;
    return {
        isExpanded: true,
        children: [],
        iconName: 'svg-icon-world',
        hasChildren: true,
        Name: RANDOM_Names[Math.floor(Math.random() * RANDOM_Names.length)],
        Color: randomLower(RANDOM_Color[Math.floor(Math.random() * RANDOM_Color.length)]),
        Animal: RANDOM_Animal[Math.floor(Math.random() * RANDOM_Animal.length)],
        Mixed: RANDOM_Mix[Math.floor(Math.random() * RANDOM_Mix.length)],
        Numbers: Math.floor(Math.random() * 30),
        IsUpdated: Math.random() >= 0.5
    };
};
export const generateTreeData = (size: number): TreeNode => {
    let treeSize: Array<number>;
    if (size === 0) {
        treeSize = [5, 5, 5, 2];
    } else {
        treeSize = [20, 100, 100];
    }
    let result: Array<TreeNode> = [];

    for (let i = 0; i < treeSize[0]; i++) {
        let treeEntry = generateTreeNode();
        for (let j = 0; j < treeSize[1]; j++) {
            let treeEntry1 = generateTreeNode();
            for (let k = 0; k < treeSize[2]; k++) {
                let treeEntry2 = generateTreeNode();
                for (let l = 0; l < treeSize[3]; l++) {
                    let treeEntry3 = generateTreeNode();
                    treeEntry3.isExpanded = false;
                    treeEntry2.children.push(treeEntry3);
                }
                treeEntry2.isExpanded = false;
                treeEntry1.children.push(treeEntry2);
            }
            treeEntry.children.push(treeEntry1);
        }
        result.push(treeEntry);
    }
    //  alert(totalItems);
    return {
        children: result
    };
};

function randomizeCase(val: string): string {
    let ans = '';
    const coinFlip = () => Math.random() > 0.5;
    for (let i = 0; i < val.length; ++i) {
        ans += coinFlip() ? val[i].toLowerCase() : val[i].toUpperCase();
    }
    return ans;
}

export const gridColumns1: Array<GridColumn> = [
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
    },
    {
        valueMember: 'IsUpdated',
        headerText: 'Is Updated',
        width: 100,
        dataType: DataTypeEnum.Boolean,
        boolFormatType: BoolFormatTypeEnum.TextOnly
    },
    {
        valueMember: 'DummyObject.IsHere',
        headerText: 'DummyObject Property',
        width: 100,
        dataType: DataTypeEnum.Boolean,
        boolFormatType: BoolFormatTypeEnum.TextOnly
    }
];

export function getTreeGridData(size: number): TreeDataSource<GridData> {
    const treeData = new TreeDataSource<GridData>(generateTreeData(size));
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
    },
    {
        valueMember: 'IsUpdated',
        headerText: 'Is Updated',
        width: 100,
        dataType: DataTypeEnum.Boolean,
        boolFormatType: BoolFormatTypeEnum.TextOnly
    },
    {
        valueMember: 'DummyObject.IsHere',
        headerText: 'DummyObject Property',
        // Null value should be handled on the definition side
        getCellValue: (rowData) => { return rowData.DummyObject != null ? rowData.DummyObject.IsHere : false; },
        width: 100,
        dataType: DataTypeEnum.Boolean,
        boolFormatType: BoolFormatTypeEnum.TextOnly
    },
    {
        dataMember: 'DateFormatted',
        valueMember: 'DateRaw',
        headerText: 'Date',
        width: 100
    },
    {
        dataMember: 'AmountString',
        valueMember: 'AmountRaw',
        headerText: 'Amount',
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
        const date = randomDate(new Date(2012, 0, 1), new Date());
        data.push(
            {
                RandomWords: randomizeCase(RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)]),
                Color: RANDOM_Color[Math.floor(Math.random() * RANDOM_Color.length)],
                Animal: RANDOM_Animal[Math.floor(Math.random() * RANDOM_Animal.length)],
                Mixed: RANDOM_Mix[Math.floor(Math.random() * RANDOM_Mix.length)],
                Numbers: Math.floor(Math.random() * 30),
                IsUpdated: Math.random() >= 0.5,
                DummyObject: Math.random() >= 0.2 ? { IsHere: Math.random() >= 0.5 } : null,
                DateFormatted: date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ' - value member: ' + date.getTime(),
                DateRaw: date.getTime(),
                AmountRaw: Math.floor(i / 10000),
                AmountString: Math.floor(i / 10000).toString().concat(' kn')
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
                Color: RANDOM_Color[Math.floor(Math.random() * RANDOM_Color.length)]
            }
        );
    }
    return { grid: data };
}

function randomDate(start: Date, end): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
