export type Item = {
    id: string,
    label: string,
}

// Create example data
export function getExampleList(amount: number): Item[] {
    let count = 0;

    return Array.from({length: amount}, (): Item => {
        const id = `task:${count++}`;
        return { id, label: `Task: ${id}` }
    })
}

const itemKey = Symbol('listItem')
export type ItemData = { [itemKey]: true, index: number }

// Wrap concrete data in symbol keyed type
export function getItemData(index: number): ItemData {
    return { [itemKey]: true, index: index };
}

// True if data received is of the type used with getInitialData on draggable. Use with canDrop/ canMonitor
export function isItemData(data: Record<symbol | string, unknown>): data is ItemData {
    return data[itemKey] === true;
}
