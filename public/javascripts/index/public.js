const allPosts = document.querySelectorAll(".post");
const postDetailDialog = document.getElementById("post-detail-dialog");
const showPostDetail = (p) => {
  const title = p.querySelector(".title").textContent;
  const description = p.querySelector(".description").textContent;

  const postDetailTitleEle = postDetailDialog.querySelector(".title");
  postDetailTitleEle.textContent = title;

  const postDetailDescriptionEle =
    postDetailDialog.querySelector(".description");
  postDetailDescriptionEle.textContent = description;

  postDetailDialog.showModal();
};

allPosts.forEach((p) => {
  p.addEventListener("click", () => showPostDetail(p));
});
