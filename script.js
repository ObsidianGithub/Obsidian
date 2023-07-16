// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  const searchIcon = document.querySelector('.search-icon');
  const searchInput = document.querySelector('.search-input');
  const videoContainers = document.querySelectorAll('.video-container');
  const videoPlayers = document.querySelectorAll('.video-player');
  const likeButtons = document.querySelectorAll('.like-button');
  const commentButtons = document.querySelectorAll('.comment-button');
  const commentForms = document.querySelectorAll('.comment-form');
  const uploadInput = document.getElementById('upload-input');

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

  videoPlayers.forEach((player) => {
    player.addEventListener('play', () => {
      pauseOtherVideos(player);
    });

    player.addEventListener('click', () => {
      toggleVideoPlayback(player);
    });

    player.addEventListener('keypress', (event) => {
      if (event.code === 'Space') {
        toggleVideoPlayback(player);
      }
    });
  });

  likeButtons.forEach((likeButton) => {
    const videoId = likeButton.getAttribute('data-video-id');
    const likeStatus = localStorage.getItem(videoId);

    if (likeStatus === 'liked') {
      likeButton.classList.add('liked');
      likeButton.innerHTML = '<img src="liked.png" alt="Liked">';
    }

    likeButton.addEventListener('click', () => {
      if (likeButton.classList.contains('liked')) {
        likeButton.classList.remove('liked');
        likeButton.innerHTML = '<img src="like.png" alt="Like">';
        localStorage.setItem(videoId, 'like');
      } else {
        likeButton.classList.add('liked');
        likeButton.innerHTML = '<img src="liked.png" alt="Liked">';
        localStorage.setItem(videoId, 'liked');
      }
    });
  });

  commentButtons.forEach((commentButton) => {
    commentButton.addEventListener('mouseenter', () => {
      const commentOverlay = commentButton.parentNode.querySelector('.comment-overlay');
      commentOverlay.style.display = 'flex';
    });

    commentButton.addEventListener('mouseleave', () => {
      const commentOverlay = commentButton.parentNode.querySelector('.comment-overlay');
      commentOverlay.style.display = 'none';
    });

    commentButton.addEventListener('click', () => {
      const commentOverlay = commentButton.parentNode.querySelector('.comment-overlay');
      const commentForm = commentOverlay.querySelector('.comment-form');
      const commentsContainer = commentOverlay.querySelector('.comments-container');
      const commentInput = commentForm.querySelector('.comment-input');

      commentForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const commentText = commentInput.value;
        if (commentText) {
          const comment = createComment(commentText);
          commentsContainer.appendChild(comment);
          commentInput.value = '';
        }
      });
    });
  });

  uploadInput.addEventListener('change', () => {
    const file = uploadInput.files[0];
    if (file && file.type === 'video/mp4') {
      const formData = new FormData();
      formData.append('video', file);

      fetch('/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (response.ok) {
            return response.text();
          }
          throw new Error('Error uploading video.');
        })
        .then(() => {
          location.reload();
        })
        .catch(error => {
          console.error(error);
        });
    }
  });

  function createVideoBox(videoSrc) {
    const videoBox = document.createElement('div');
    videoBox.className = 'video-box';
    videoBox.innerHTML = `
            <video class="video-player" src="${videoSrc}"></video>
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

  function pauseOtherVideos(currentPlayer) {
    videoPlayers.forEach((player) => {
      if (player !== currentPlayer) {
        player.pause();
      }
    });
  }

  function createComment(commentText) {
    const comment = document.createElement('div');
    comment.className = 'comment';
    comment.textContent = commentText;
    return comment;
  }
});
