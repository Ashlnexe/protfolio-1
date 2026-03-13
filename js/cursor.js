if (window.matchMedia('(pointer: fine)').matches) {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        outline.style.left = outlineX + 'px';
        outline.style.top = outlineY + 'px';
        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    document.addEventListener('mouseover', (e) => {
        const t = e.target;
        if (
            t.tagName === 'A' || t.tagName === 'BUTTON' ||
            t.closest('a') || t.closest('button') ||
            t.classList.contains('hover-target')
        ) {
            outline.classList.add('hovering');
        } else {
            outline.classList.remove('hovering');
        }
    });
}
