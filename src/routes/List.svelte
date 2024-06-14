<script lang="ts">
    import ListItem from "./ListItem.svelte";
    import { getExampleList, type Item, isItemData } from "$lib/list-data";
    import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
    import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
    import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
    import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
    import { onMount } from "svelte";

    let exampleList: Item[] = getExampleList(10000);

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

                setTimeout(() => {
                    const element = document.querySelector(`[data-item-index="${targetData.index}"]`);
                    if (element instanceof HTMLElement) {
                        triggerPostMoveFlash(element);
                    }
                }, 100)
            }
        })
    })

</script>


<div class="h-[500px] w-full overflow-auto">
{#each exampleList as item, index (item.id)}
    <ListItem item={item} index={index}/>
{/each}
</div>
