<script lang="ts">
    import type { Item } from "$lib/list-data";
    import { getItemData, isItemData } from "$lib/list-data";
    import { onMount } from "svelte";
    import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
    import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

    type DragState = 'idle' | 'is-dragging' | 'is-dragging-over' | 'preview';
    const stateStyles: { [Key in DragState]?: string } = {
        'is-dragging': 'opacity-40',
        'is-dragging-over': 'bg-slate-400',
    }

    export let item: Item;
    export let index: number;

    let element: HTMLElement;
    let state: DragState = 'idle';

    onMount(() => {
        return combine(
            draggable({
                element,
                getInitialData: () => { return getItemData(index) },
                onDragStart: () => state = 'is-dragging',
                onDrop: () => state = 'idle',
            }),
            dropTargetForElements({
                element,
                canDrop: ({ source }) => {
                    if (source.element === element) {
                        return false;
                    }
                    return isItemData(source.data);
                },
                getData: () => {
                    return getItemData(index);
                },
                onDragEnter: () => {
                    if (state !== 'is-dragging') {
                        state = 'is-dragging-over';
                    }
                },
                onDragLeave: () => {
                    if (state !== 'is-dragging') {
                        state = 'idle';
                    }
                },
                onDrop: () => {
                    state = 'idle';
                }
            })
        )
    })

</script>

<div bind:this={element} data-item-index={index} class={`m-1 p-1 border border-black ${stateStyles[state] ?? ''}`}>
    {item.label}
</div>
