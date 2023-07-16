document.addEventListener('DOMContentLoaded', function () {
  const videoContainer = document.getElementById('videoContainer');
  const uploadForm = document.getElementById('uploadForm');
  const uploadInput = document.getElementById('uploadInput');

  // Retrieve existing video URLs from local storage
  const storedVideos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];

  // Display existing videos on page load
  storedVideos.forEach(function (videoUrl) {
    const videoBox = createVideoBox(videoUrl);
    videoContainer.appendChild(videoBox);
  });

  // Handle video upload form submission
  uploadForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const file = uploadInput.files[0];
    if (file && file.type === 'video/mp4') {
      const reader = new FileReader();
      reader.onload = function (event) {
        const videoUrl = event.target.result;

        // Save the video URL to local storage
        storedVideos.push(videoUrl);
        localStorage.setItem('uploadedVideos', JSON.stringify(storedVideos));

        // Create and append video box to the container
        const videoBox = createVideoBox(videoUrl);
        videoContainer.appendChild(videoBox);

        // Reset the upload form
        uploadForm.reset();
      };
      reader.readAsDataURL(file);
    }
  });

  function createVideoBox(videoUrl) {
    const videoBox = document.createElement('div');
    videoBox.className = 'video-box';
    // Create video player and other elements
    // Set the video source to the provided URL
    videoBox.innerHTML = `
      <video class="video-player" src="${videoUrl}"></video>
      <!-- Other elements -->
    `;
    return videoBox;
  }
});
