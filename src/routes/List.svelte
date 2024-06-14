<script lang="ts">
    import ListItem from "./ListItem.svelte";
    import { getExampleList, type Item, isItemData } from "$lib/list-data";
    import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
    import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
    import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
    import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
    import { onMount } from "svelte";
    import { createVirtualizer } from "@tanstack/svelte-virtual";

    let exampleList: Item[] = getExampleList(10000);
    let count = exampleList.length;

    onMount(() => {
        return monitorForElements({
            canMonitor({ source }) {
                return isItemData(source.data);
            },
            onDrop: ({ location, source }) => {
                const target = location.current.dropTargets[0];
                if (!target) {
                    return;
                }
                const sourceData = source.data;
                const targetData = target.data;

                if (!isItemData(sourceData) || !isItemData(targetData)) {
                    return;
                }

                const sourceIndex = sourceData.index;
                const targetIndex = targetData.index;


                const closestEdge = sourceIndex > targetIndex ? 'top' as Edge : 'bottom' as Edge;
                exampleList = reorderWithEdge({
                    list: exampleList,
                    startIndex: sourceIndex,
                    indexOfTarget: targetIndex,
                    closestEdgeOfTarget: closestEdge,
                    axis: 'vertical',
                })

                virtualItems = $virtualizer.getVirtualItems();

                setTimeout(() => {
                    const element = document.querySelector(`[data-item-index="${targetData.index}"]`);
                    if (element instanceof HTMLElement) {
                        triggerPostMoveFlash(element);
                    }
                }, 100)
            }
        })
    })

    let scrollElement: HTMLDivElement;

    $: virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
        count,
        getScrollElement: () => scrollElement,
        estimateSize: () => 40,
        overscan: 5
    })

    $: virtualItems = $virtualizer.getVirtualItems();

</script>


<div bind:this={scrollElement} class="h-screen w-full overflow-auto">
    <div
        style="position: relative; height: {$virtualizer.getTotalSize()}px; width: 100%"
    >
        {#each virtualItems as virtualItem (exampleList[virtualItem.index].id)}
            <div
                style="position: absolute; top: 0; left: 0; width: 100%; height: {virtualItem.size}; transform: translateY({virtualItem.start}px);"
            >
                <ListItem item={exampleList[virtualItem.index]} index={virtualItem.index}/>
            </div>
        {/each}
    </div>
</div>

