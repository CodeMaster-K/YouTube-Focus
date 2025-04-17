const API_KEY = "AIzaSyCzHgotCVv71vYcn3AjX-FB4I9E35dAW0E";
    let nextPageToken = "";
    let currentChannelId = "";
    let currentSearchTerm = "";
    let currentResultType = "all";
    let maxResults = 25;
    
    document.getElementById("searchBtn").addEventListener("click", () => {
      currentSearchTerm = document.getElementById("searchTerm").value.trim();
      currentResultType = document.getElementById("resultType").value;
      const manualChannelId = document.getElementById("channelIdInput").value.trim();
      
      if (manualChannelId) {
        currentChannelId = manualChannelId;
      } else {
        const selectedValue = document.getElementById("channelSelect").value;
        if (selectedValue !== "none") {
          currentChannelId = selectedValue;
        } else {
          currentChannelId = ""; // No channel restriction
        }
      }
      nextPageToken = "";
      searchVideos();
    });
    
    document.getElementById("loadMore").addEventListener("click", () => {
      if (nextPageToken) {
        searchVideos(true);
      }
    });
    
    function searchVideos(isLoadMore = false) {
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${isLoadMore ? 15 : 25}&key=${API_KEY}`;
      if (currentSearchTerm) {
        url += `&q=${encodeURIComponent(currentSearchTerm)}`;
      }
      if (currentChannelId) {
        url += `&channelId=${currentChannelId}`;
      }
      if (currentResultType !== "all") {
        url += `&type=${currentResultType === "short" ? "video" : currentResultType}`;
        if (currentResultType === "short") {
          url += "&videoDuration=short";
        }
      }
      if (isLoadMore && nextPageToken) {
        url += `&pageToken=${nextPageToken}`;
      }
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          nextPageToken = data.nextPageToken || "";
          displayVideos(data.items, isLoadMore);
          document.getElementById("loadMoreBtn").style.display = nextPageToken ? "block" : "none";
        })
        .catch(err => console.error(err));
    }
    
    function displayVideos(videos, isLoadMore) {
      const resultsDiv = document.getElementById("results");
      if (!isLoadMore) resultsDiv.innerHTML = "";
      videos.forEach(video => {
        const videoId = video.id.videoId || video.id.playlistId || video.id.channelId;
        const title = video.snippet.title;
        resultsDiv.innerHTML += `
          <div class="video-card">
            <iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
            <div class="video-title">${title}</div>
          </div>`;
      });
    }