/**
 * Allow mouse dragging outside the dragged element.
 * @param immediatelyTriggerEvent If not null, immediately trigger drag move event when called
 * @param onDragMove
 * @param onDragEnd
 */
export function addGlobalDragListener(
    immediatelyTriggerEvent: PointerEvent | null,
    onDragMove: (e: PointerEvent) => void,
    onDragEnd?: (e: PointerEvent) => void
) {
    let onPointerUp: (e: PointerEvent) => void;
    let onPointerOut: (e: PointerEvent) => void;
    let _onDragMove = (e: PointerEvent) => {
        return onDragMove(e);
    };
    let _onDragEnd = (e: PointerEvent) => {
        document.removeEventListener('pointermove', _onDragMove);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointerout', onPointerOut);
        return onDragEnd && onDragEnd(e);
    };
    onPointerUp = _onDragEnd;
    onPointerOut = (e: PointerEvent) => {
        if (!e.relatedTarget || ((e.relatedTarget as HTMLElement).nodeName === 'HTML')) {
            _onDragEnd(e);
        }
    };

    document.addEventListener('pointermove', _onDragMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointerout', onPointerOut);

    if (immediatelyTriggerEvent) {
        _onDragMove(immediatelyTriggerEvent);
    }
}

export function isScrolledIntoView(elem: HTMLElement) {
    const rect = elem.getBoundingClientRect();
    if (!elem.parentElement) {
        const top = window.scrollY;
        const bottom = top + window.innerHeight;
        return !(rect.top >= bottom || rect.bottom <= top);
    }
    const parentRect = elem.parentElement.getBoundingClientRect();
    return !(rect.bottom <= parentRect.top || rect.top >= parentRect.bottom);
}

export function isElementInViewport(elem: Element) {
    const rect = elem.getBoundingClientRect(),
        width = rect.right - rect.left,
        height = rect.bottom - rect.top;
    return (
        rect.top > -height &&
        rect.left > -width &&
        rect.bottom < (window.innerHeight || document.documentElement.clientHeight) + height &&
        rect.right < (window.innerWidth || document.documentElement.clientWidth) + width
    );
}
