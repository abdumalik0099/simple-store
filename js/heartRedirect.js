export default function initHeartRedirect() {
  const heartToIndex = document.getElementById("heartToIndex");
  if (!heartToIndex) return;

  heartToIndex.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}

