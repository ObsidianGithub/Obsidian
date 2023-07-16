document.addEventListener('DOMContentLoaded', function () {
  const searchIcon = document.querySelector('.search-icon');
  const searchInput = document.querySelector('.search-input');
  const videoContainers = document.querySelectorAll('.video-container');
  const likeButtons = document.querySelectorAll('.like-button');
  const commentButtons = document.querySelectorAll('.comment-button');
  const commentForms = document.querySelectorAll('.comment-form');
  const uploadInput = document.getElementById('upload-input');
  const localStorageKey = 'uploadedVideos';

  // Retrieve uploaded videos from localStorage
  const uploadedVideos = localStorage.getItem(localStorageKey)
    ? JSON.parse(localStorage.getItem(localStorageKey))
    : [];

  // Render uploaded videos
  uploadedVideos.forEach((videoSrc) => {
    const videoBox = createVideoBox(videoSrc);
    const videoContainer = createVideoContainer(videoBox);
    const mainElement = document.querySelector('main');
    mainElement.appendChild(videoContainer);
  });

  searchIcon.addEventListener('click', () => {
    searchInput.classList.toggle('expand');
  });

  searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.trim().toLowerCase();

    videoContainers.forEach((videoContainer) => {
      const videoBox = videoContainer.querySelector('.video-box');
      const videoTitle = videoBox.textContent.toLowerCase();
      if (videoTitle.includes(searchValue)) {
        videoContainer.style.display = 'block';
      } else {
        videoContainer.style.display = 'none';
      }
    });
  });

  document.addEventListener('click', function (event) {
    const videoPlayer = event.target.closest('.video-player');
    if (videoPlayer) {
      toggleVideoPlayback(videoPlayer);
    }
  });

  document.addEventListener('click', function (event) {
    const likeButton = event.target.closest('.like-button');
    if (likeButton) {
      const videoId = likeButton.getAttribute('data-video-id');
      const likeStatus = localStorage.getItem(videoId);

      if (likeStatus === 'liked') {
        likeButton.classList.remove('liked');
        likeButton.innerHTML = '<img src="like.png" alt="Like">';
        localStorage.setItem(videoId, 'like');
      } else {
        likeButton.classList.add('liked');
        likeButton.innerHTML = '<img src="liked.png" alt="Liked">';
        localStorage.setItem(videoId, 'liked');
      }
    }
  });

  document.addEventListener('mouseenter', function (event) {
    const commentButton = event.target.closest('.comment-button');
    if (commentButton) {
      const commentOverlay = commentButton.parentNode.querySelector('.comment-overlay');
      commentOverlay.style.display = 'flex';
    }
  });

  document.addEventListener('mouseleave', function (event) {
    const commentButton = event.target.closest('.comment-button');
    if (commentButton) {
      const commentOverlay = commentButton.parentNode.querySelector('.comment-overlay');
      commentOverlay.style.display = 'none';
    }
  });

  document.addEventListener('submit', function (event) {
    const commentForm = event.target.closest('.comment-form');
    if (commentForm) {
      event.preventDefault();

      const commentInput = commentForm.querySelector('.comment-input');
      const commentText = commentInput.value;
      if (commentText) {
        const commentsContainer = commentForm.parentNode.querySelector('.comments-container');
        const comment = createComment(commentText);
        commentsContainer.appendChild(comment);
        commentInput.value = '';
      }
    }
  });

  uploadInput.addEventListener('change', () => {
    const file = uploadInput.files[0];
    if (file && file.type === 'video/mp4') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const videoSrc = event.target.result;
        const videoBox = createVideoBox(videoSrc);
        const videoContainer = createVideoContainer(videoBox);
        const mainElement = document.querySelector('main');
        mainElement.appendChild(videoContainer);

        // Store uploaded video in localStorage
        uploadedVideos.push(videoSrc);
        localStorage.setItem(localStorageKey, JSON.stringify(uploadedVideos));

        // Scroll to the new video
        videoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      reader.readAsDataURL(file);
    }
  });

  function createVideoBox(videoSrc) {
    const videoBox = document.createElement('div');
    videoBox.className = 'video-box';
    videoBox.innerHTML = `
            <video class="video-player" src="${videoSrc}" controls></video>
            <div class="like-button" data-video-id="${generateRandomId()}">
                <img src="like.png" alt="Like">
            </div>
            <button class="comment-button" data-video-id="${generateRandomId()}"></button>
            <div class="group-info">
                <div class="pfp"></div>
                <span class="group-name">@DancingCat</span>
            </div>
            <div class="comment-overlay">
                <form class="comment-form">
                    <input class="comment-input" type="text" placeholder="Type a comment...">
                </form>
                <div class="comments-container"></div>
            </div>
        `;
    return videoBox;
  }

  function createVideoContainer(videoBox) {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    videoContainer.appendChild(videoBox);
    return videoContainer;
  }

  function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
  }

  function toggleVideoPlayback(player) {
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  }

  function createComment(commentText) {
    const comment = document.createElement('div');
    comment.className = 'comment';
    comment.textContent = commentText;
    return comment;
  }
});
