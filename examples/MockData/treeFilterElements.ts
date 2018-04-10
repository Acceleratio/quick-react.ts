import { TreeItem } from '../../src';

const RANDOM_WORDS = ['abstrusity', 'advertisable', 'bellwood', 'benzole', 'disputative', 'djilas', 'ebracteate', 'zonary'];

export function createFlatList(numOfItems) {
    let data = [];
    for (let i = 0; i < numOfItems; i++) {
        let name = RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)];
        data.push({ id: i, value: i + ' ' + name });
    }
    return data;
}

export function getSelectedIds(numOfItems) {
    let ids = [];
    for (let i = 0; i < numOfItems; i++) {
        ids.push(i.toString());
    }
    return ids;
}

// Function to fill TreeView Data which I used to test the performance. Doesn't hurt if it stays here
let id = 0;

export function createData(hierarchy: Array<number>, depth = 0) {
    const data: Array<TreeItem> = [];

    if (depth < hierarchy.length) {
        for (let i = 0; i < hierarchy[depth]; i++) {
            const name = RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)];
            const identifier = id++;
            const treeItem: TreeItem = {
                expanded: true,
                id: identifier + '',
                value: identifier + ' ' + name,
                iconName: Math.random() > 0.8 ? 'icon-edit_user' : '',
                iconClassName: 'color',
                hasChildren: depth + 1 < hierarchy.length,
                hoverOverBtn: [{
                    iconName: 'icon-edit',
                    // tslint:disable-next-line:no-console
                    callback: (item) => console.log(item.id),
                    tooltip: { content: 'This is tooltip! This is tooltip! This is tooltip!' }
                },
                {
                    iconName: 'icon-trash',
                    // tslint:disable-next-line:no-console
                    callback: (item) => console.log(item)
                }],
                children: createData(hierarchy, depth + 1)
            };
            data.push(treeItem);
        }
    }

    return data;
}

export function createRandomizedData(numOfItems, maxDepth) {

    const createRandomizedItem = (key, depth) => {
        let children = [];
        let name = RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)];

        let numChildren = depth < maxDepth ? 4 : 0;
        for (let i = 0; i < numChildren; i++) {
            children.push(createRandomizedItem(key + '-' + i, depth + 1));
        }
        return {
            id: key,
            value: key + ' ' + name,
            expanded: false,
            children: children,
            iconName: Math.random() > 0.8 ? 'icon-edit_user' : '',
            iconClassName: 'color',
            hoverOverBtn: [{
                iconName: 'icon-edit',
                // tslint:disable-next-line:no-console
                callback: (item) => console.log(item.id),
                tooltip: { content: 'This is tooltip! This is tooltip! This is tooltip!' }
            },
            {
                iconName: 'icon-trash',
                // tslint:disable-next-line:no-console
                callback: (item) => console.log(item)
            }]
        };
    };

    let data = [];
    for (let i = 0; i < numOfItems; i++) {
        data.push(createRandomizedItem(i, 0));
    }
    return data;
}

export function createAsyncLoadRandomizedData(numOfItems, maxDepth) {
    const createRandomizedItem = (key, depth) => {
        let children = [];
        let hasChildren;
        let name = RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)];
        if (Math.random() > 0.3) {
            hasChildren = true;
        } else {
            let numChildren = depth < maxDepth ? 4 : 0;
            for (let i = 0; i < numChildren; i++) {
                children.push(createRandomizedItem(key + '-' + i, depth + 1));
            }
        }
        return {
            id: key,
            value: key + ' ' + name,
            expanded: false,
            children: children,
            iconName: Math.random() > 0.8 ? 'icon-edit_user' : '',
            iconClassName: 'color',
            hasChildren: hasChildren
        };
    };

    let data = [];
    for (let i = 0; i < numOfItems; i++) {
        data.push(createRandomizedItem(i, 0));
    }
    return data;

}

export function createCustomTooltipContentRandomizedData() {
    const createRandomizedItem = (key, depth) => {
        let children = [];
        let name = RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)];

        let numChildren = depth < 2 ? 4 : 0;
        for (let i = 0; i < numChildren; i++) {
            children.push(createRandomizedItem(key + '-' + i, depth + 1));
        }
        return {
            id: key,
            value: key + ' ' + name,
            expanded: false,
            children: children,
            iconName: 'icon-edit_user',
            iconClassName: 'color',
            iconTooltipContent: 'Edit user object'
        };
    };

    let data = [];
    for (let i = 0; i < 5; i++) {
        data.push(createRandomizedItem(i, 0));
    }
    return data;
}
