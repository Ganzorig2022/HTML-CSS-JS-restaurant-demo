const userProfileBtn = document.getElementsByClassName("profile")[0];

userProfileBtn.addEventListener("click", () => {
  console.log("clicked");
  const userProfile = document.getElementsByClassName("user-profile-modal")[0];
  userProfile.classList.toggle("hidden");
});
