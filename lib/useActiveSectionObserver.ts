import { useEffect, useRef } from 'react';

export function useActiveSectionObserver(
    sectionCount: number,
    onActiveIndexChange: (index: number) => void
) {
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const callbackRef = useRef(onActiveIndexChange);
    callbackRef.current = onActiveIndexChange;

    useEffect(() => {
        sectionRefs.current = sectionRefs.current.slice(0, sectionCount);

        const observer = new IntersectionObserver(
        (entries) => {
            // Cari entry yang paling dekat dengan garis batas atas (rootMargin),
            // di antara section-section yang sedang berpotongan dengan area itu.
            const visibleEntries = entries.filter((entry) => entry.isIntersecting);
            if (visibleEntries.length === 0) return;

            const topMostEntry = visibleEntries.reduce((closest, entry) =>
            entry.boundingClientRect.top < closest.boundingClientRect.top ? entry : closest
            );

            const index = sectionRefs.current.findIndex((el) => el === topMostEntry.target);
            if (index !== -1) {
            callbackRef.current(index);
            }
        },
        {
            // Anggap section "aktif" begitu headernya melewati garis ~15% dari
            // atas viewport scroll container, sampai sebelum 70% dari bawah.
            rootMargin: '-15% 0px -70% 0px',
            threshold: 0
        }
        );

        sectionRefs.current.forEach((el) => {
        if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sectionCount]);

    // Ref callback untuk dipasang ke elemen section pada index tertentu.
    const setSectionRef = (index: number) => (el: HTMLElement | null) => {
        sectionRefs.current[index] = el;
    };

    return setSectionRef;
}