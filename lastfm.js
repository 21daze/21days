// Last.fm Monthly Top Artists Fetcher
// Note: Last.fm API requires an API key. Get one at https://www.last.fm/api/account/create

async function fetchLastFMTopArtists(username) {
  const API_KEY = '1c8aa69225002514da263d64c4b48549';
  const API_URL = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&period=1month&limit=10&api_key=${API_KEY}&format=json`;
  
  const artistsContainer = document.getElementById('lastfm-artists');
  if (!artistsContainer) return;
  
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (data.error) {
      artistsContainer.innerHTML = `<div class="lastfm-error">${data.message}</div>`;
      return;
    }
    
    const artists = data.topartists?.artist || [];
    
    if (artists.length === 0) {
      artistsContainer.innerHTML = `<div class="lastfm-error">No artists found for this period.</div>`;
      return;
    }
    
    let html = '';
    artists.forEach((artist, index) => {
      const rank = index + 1;
      const name = artist.name;
      const playcount = parseInt(artist.playcount) || 0;
      const url = artist.url;
      
      html += `
        <div class="lastfm-artist">
          <span class="lastfm-rank">${rank}</span>
          <div class="lastfm-artist-info">
            <div class="lastfm-artist-name">
              <a href="${url}" target="_blank">${name}</a>
            </div>
            <div class="lastfm-playcount">${playcount.toLocaleString()} ${playcount === 1 ? 'play' : 'plays'}</div>
          </div>
        </div>
      `;
    });
    
    artistsContainer.innerHTML = html;
    
  } catch (error) {
    console.error('Error fetching Last.fm data:', error);
    
    // Fallback: Show instructions
    artistsContainer.innerHTML = `
      <div class="lastfm-error">
        Unable to load top artists.<br>
        <small>Add your Last.fm API key in lastfm.js or use an embed widget.</small>
      </div>
    `;
  }
}

// Alternative: Use Last.fm embed widget (no API key needed but less customizable)
function useLastFMEmbed(username) {
  const artistsContainer = document.getElementById('lastfm-artists');
  if (!artistsContainer) return;
  
  // Create iframe embed
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.last.fm/user/${username}/library/artists?date_preset=LAST_30_DAYS`;
  iframe.width = '100%';
  iframe.height = '400';
  iframe.frameBorder = '0';
  iframe.scrolling = 'no';
  iframe.style.border = 'none';
  iframe.style.background = 'transparent';
  
  artistsContainer.innerHTML = '';
  artistsContainer.appendChild(iframe);
}

// Auto-load when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const username = 'amaann';
  
  // Use API with real data
  fetchLastFMTopArtists(username);
});

