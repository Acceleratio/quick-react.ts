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

export function createRandomizedData(numOfItems, maxDepth, async = false) {

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
            alwaysExpandable: numChildren === 0 ? async : false,
            iconName: Math.random() > 0.8 ? 'icon-edit_user' : '',
            iconClassName: 'color'
        };
    };

    let data = [];
    for (let i = 0; i < numOfItems; i++) {
        data.push(createRandomizedItem(i, 0));
    }
    return data;
}
