export default function initSingleRedirect({ pagePath } = {}) {
  const resolvedPagePath = pagePath || "./html/single.html";

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest(".eye-btn");
    if (!button) return;

    const id = button.getAttribute("data-id");
    if (!id) return;

    window.location.href = `${resolvedPagePath}?id=${encodeURIComponent(id)}`;
  });
}

