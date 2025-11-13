// Fetch Last.fm monthly top artists
async function fetchLastFMTopArtists(username) {
  try {
    // Using Last.fm API - you'll need to get an API key from last.fm/api
    // For now, using a CORS proxy approach or direct embed
    // Alternative: Use Last.fm's RSS feed or JSON endpoint
    
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&period=1month&limit=10&api_key=YOUR_API_KEY&format=json`);
    
    // If API key not available, use alternative method
    // You can also embed via iframe or use a service like lastfm.js
    
    // For now, let's create a placeholder that shows the structure
    // User should replace this with actual API call or use a widget service
    
    const artistsContainer = document.getElementById('lastfm-artists');
    if (!artistsContainer) return;
    
    // Placeholder - replace with actual API call
    artistsContainer.innerHTML = `
      <div class="lastfm-error">
        Please add your Last.fm API key or use an embed service.<br>
        Visit: <a href="https://www.last.fm/api" target="_blank">last.fm/api</a>
      </div>
    `;
    
  } catch (error) {
    const artistsContainer = document.getElementById('lastfm-artists');
    if (artistsContainer) {
      artistsContainer.innerHTML = `<div class="lastfm-error">Error loading top artists. Check API configuration.</div>`;
    }
  }
}

// Alternative: Use Last.fm's user widget embed
function loadLastFMEmbed(username) {
  const artistsContainer = document.getElementById('lastfm-artists');
  if (!artistsContainer) return;
  
  // Use Last.fm's JSON endpoint via CORS proxy or direct fetch if available
  // For now, create a styled list that user can populate
  
  // You can fetch from: https://lastfm.freetls.fastly.net/i/u/300x300/[image_hash].png for images
  // Or use Last.fm's widget system
  
  artistsContainer.innerHTML = `
    <div class="lastfm-artist">
      <span class="lastfm-rank">1</span>
      <div class="lastfm-artist-info">
        <div class="lastfm-artist-name">Loading...</div>
        <div class="lastfm-playcount">— scrobbles</div>
      </div>
    </div>
  `;
  
  // Try to fetch from Last.fm API (requires API key)
  // Or use iframe embed: https://www.last.fm/user/${username}/library/artists?date_preset=LAST_30_DAYS
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
    e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Window minimize/expand functionality
  const window = document.querySelector('.landing-content');
  const titleBar = document.querySelector('.window-title-bar');
  const socialWindow = document.querySelector('.social-window');
  const socialTitleBar = socialWindow ? socialWindow.querySelector('.window-title-bar') : null;
  const relearningWindow = document.querySelector('.relearning-window');
  const relearningTitleBar = relearningWindow ? relearningWindow.querySelector('.window-title-bar') : null;
  const relearningHearWindow = document.querySelector('.relearning-hear-window');
  const relearningHearTitleBar = relearningHearWindow ? relearningHearWindow.querySelector('.window-title-bar') : null;
  
  // Start minimized (only about-me window)
  if (window) {
    window.classList.add('minimized');
  }
  // Social window stays open
  // Relearning window stays open (not minimized)
  // Relearning Hear window stays open (not minimized)
  
  if (window && titleBar) {
    let isDragging = false;
    let startX;
    let startY;
    let initialX;
    let initialY;
    let mouseMoved = false;

    // Toggle window on title bar click (when not dragging)
    titleBar.addEventListener('click', function(e) {
      // Don't toggle if clicking window controls or if we just dragged
      if (e.target.tagName === 'BUTTON' || mouseMoved) {
        mouseMoved = false;
        return;
      }
      
      if (window.classList.contains('minimized')) {
        window.classList.remove('minimized');
        window.style.height = '';
        window.style.maxHeight = '90vh';
        
        // Move about-me window over the Last.fm window when opening
        if (socialWindow) {
          const socialRect = socialWindow.getBoundingClientRect();
          const socialLeft = socialRect.left;
          const socialTop = socialRect.top;
          
          // Position about-me window over Last.fm window (offset slightly)
          window.style.right = 'auto';
          window.style.left = `${socialLeft - 50}px`;
          window.style.top = `${socialTop - 50}px`;
          window.style.transition = 'left 0.3s ease, top 0.3s ease';
          
          // Bring to front
          window.style.zIndex = '3';
          socialWindow.style.zIndex = '2';
        }
      } else {
        window.classList.add('minimized');
        window.style.height = '22px';
        window.style.maxHeight = '22px';
      }
    });

    // Make the window draggable
    titleBar.addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'BUTTON') {
        return; // Don't drag if clicking window controls
      }
      
      mouseMoved = false;
      const startMouseX = e.clientX;
      const startMouseY = e.clientY;
      
      // Calculate initial position
      const rect = window.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      
      startX = e.clientX - initialX;
      startY = e.clientY - initialY;

      const onMouseMove = function(moveEvent) {
        const deltaX = Math.abs(moveEvent.clientX - startMouseX);
        const deltaY = Math.abs(moveEvent.clientY - startMouseY);
        
        // If mouse moved more than 5px, it's a drag
        if (deltaX > 5 || deltaY > 5) {
          mouseMoved = true;
          
          if (!isDragging) {
            isDragging = true;
            titleBar.style.cursor = 'grabbing';
            window.style.cursor = 'grabbing';
          }
          
          const x = moveEvent.clientX - startX;
          const y = moveEvent.clientY - startY;

          // Keep window within viewport bounds
          const currentRect = window.getBoundingClientRect();
          const maxX = window.innerWidth - currentRect.width;
          const maxY = window.innerHeight - currentRect.height;
          const constrainedX = Math.max(0, Math.min(x, maxX));
          const constrainedY = Math.max(0, Math.min(y, maxY));

          // Update position using left/top
          window.style.right = 'auto';
          window.style.left = `${constrainedX}px`;
          window.style.top = `${constrainedY}px`;
        }
      };
      
      const onMouseUp = function() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        if (isDragging) {
          isDragging = false;
          titleBar.style.cursor = 'pointer';
          window.style.cursor = 'default';
        }
      };
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  // Social window - minimize button functionality
  if (socialWindow && socialTitleBar) {
    // Add minimize button functionality
    const minimizeBtn = socialTitleBar.querySelector('.window-minimize');
    if (minimizeBtn) {
      // Use mousedown instead of click for better reliability
      minimizeBtn.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        e.preventDefault();
      });
      
      minimizeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (socialWindow.classList.contains('minimized')) {
          socialWindow.classList.remove('minimized');
          socialWindow.style.height = '';
          socialWindow.style.maxHeight = '420px';
        } else {
          socialWindow.classList.add('minimized');
          socialWindow.style.height = '22px';
          socialWindow.style.maxHeight = '22px';
        }
        return false;
      });
    }
    
    // Header click to minimize (only if not dragging)
    let socialMouseMoved = false;
    socialTitleBar.addEventListener('click', function(e) {
      // Don't toggle if clicking window controls
      if (e.target.tagName === 'BUTTON') {
        return;
      }
      
      // Don't toggle if clicking on links
      if (e.target.tagName === 'A') {
        return;
      }
      
      // Don't toggle if we just dragged
      if (socialMouseMoved || mouseMovedSocial) {
        socialMouseMoved = false;
        mouseMovedSocial = false;
        return;
      }
      
      // Toggle minimize when clicking header area or title
      if (socialWindow.classList.contains('minimized')) {
        socialWindow.classList.remove('minimized');
        socialWindow.style.height = '';
        socialWindow.style.maxHeight = '420px';
      } else {
        socialWindow.classList.add('minimized');
        socialWindow.style.height = '22px';
        socialWindow.style.maxHeight = '22px';
      }
    });

    // Make social window smoothly draggable
    let isDraggingSocial = false;
    let startXSocial, startYSocial, initialXSocial, initialYSocial;
    let rafId = null;
    let mouseMovedSocial = false;

    socialTitleBar.addEventListener('mousedown', function(e) {
      // Don't drag if clicking window controls or links
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        return;
      }
      
      // Don't drag if clicking on title text - let click handler deal with it
      if (e.target.classList.contains('window-title')) {
        return;
      }
      
      mouseMovedSocial = false;
      const startMouseX = e.clientX;
      const startMouseY = e.clientY;
      
      const rect = socialWindow.getBoundingClientRect();
      initialXSocial = rect.left;
      initialYSocial = rect.top;
      
      startXSocial = e.clientX - initialXSocial;
      startYSocial = e.clientY - initialYSocial;

      const onMouseMove = function(moveEvent) {
        const deltaX = Math.abs(moveEvent.clientX - startMouseX);
        const deltaY = Math.abs(moveEvent.clientY - startMouseY);
        
        // If mouse moved more than 5px, it's a drag
        if (deltaX > 5 || deltaY > 5) {
          mouseMovedSocial = true;
          socialMouseMoved = true;
          
          if (!isDraggingSocial) {
            isDraggingSocial = true;
            socialTitleBar.style.cursor = 'grabbing';
            socialWindow.style.cursor = 'grabbing';
            socialWindow.style.transition = 'none';
          }
          
          // Cancel any pending animation frame
          if (rafId) {
            cancelAnimationFrame(rafId);
          }
          
          // Use requestAnimationFrame for smooth dragging
          rafId = requestAnimationFrame(function() {
            const x = moveEvent.clientX - startXSocial;
            const y = moveEvent.clientY - startYSocial;

            // Keep window within viewport bounds
            const currentRect = socialWindow.getBoundingClientRect();
            const maxX = window.innerWidth - currentRect.width;
            const maxY = window.innerHeight - currentRect.height;
            const constrainedX = Math.max(0, Math.min(x, maxX));
            const constrainedY = Math.max(0, Math.min(y, maxY));

            // Smooth position update
            socialWindow.style.right = 'auto';
            socialWindow.style.left = `${constrainedX}px`;
            socialWindow.style.top = `${constrainedY}px`;
          });
        }
      };
      
      const onMouseUp = function() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        
        if (isDraggingSocial) {
          isDraggingSocial = false;
          socialTitleBar.style.cursor = 'move';
          socialWindow.style.cursor = 'default';
          socialWindow.style.transition = ''; // Re-enable transition
        }
      };
      
      document.addEventListener('mousemove', onMouseMove, { passive: true });
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  // Relearning window functionality (same as about-me window)
  if (relearningWindow && relearningTitleBar) {
    let isDraggingRelearning = false;
    let startXRelearning, startYRelearning, initialXRelearning, initialYRelearning;
    let mouseMovedRelearning = false;

    // Toggle window on title bar click
    relearningTitleBar.addEventListener('click', function(e) {
      if (e.target.tagName === 'BUTTON' || mouseMovedRelearning) {
        mouseMovedRelearning = false;
        return;
      }
      
      if (relearningWindow.classList.contains('minimized')) {
        relearningWindow.classList.remove('minimized');
        relearningWindow.style.height = '';
        relearningWindow.style.maxHeight = '90vh';
      } else {
        relearningWindow.classList.add('minimized');
        relearningWindow.style.height = '22px';
        relearningWindow.style.maxHeight = '22px';
      }
    });

    // Make relearning window draggable
    relearningTitleBar.addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'BUTTON') {
        return;
      }
      
      mouseMovedRelearning = false;
      const startMouseX = e.clientX;
      const startMouseY = e.clientY;
      
      const rect = relearningWindow.getBoundingClientRect();
      initialXRelearning = rect.left;
      initialYRelearning = rect.top;
      
      startXRelearning = e.clientX - initialXRelearning;
      startYRelearning = e.clientY - initialYRelearning;

      const onMouseMove = function(moveEvent) {
        const deltaX = Math.abs(moveEvent.clientX - startMouseX);
        const deltaY = Math.abs(moveEvent.clientY - startMouseY);

        if (deltaX > 5 || deltaY > 5) {
          mouseMovedRelearning = true;
          
          if (!isDraggingRelearning) {
            isDraggingRelearning = true;
            relearningTitleBar.style.cursor = 'grabbing';
            relearningWindow.style.cursor = 'grabbing';
          }
          
          const x = moveEvent.clientX - startXRelearning;
          const y = moveEvent.clientY - startYRelearning;

          const currentRect = relearningWindow.getBoundingClientRect();
          const maxX = window.innerWidth - currentRect.width;
          const maxY = window.innerHeight - currentRect.height;
          const constrainedX = Math.max(0, Math.min(x, maxX));
          const constrainedY = Math.max(0, Math.min(y, maxY));

          relearningWindow.style.right = 'auto';
          relearningWindow.style.left = `${constrainedX}px`;
          relearningWindow.style.top = `${constrainedY}px`;
        }
      };
      
      const onMouseUp = function() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        if (isDraggingRelearning) {
          isDraggingRelearning = false;
          relearningTitleBar.style.cursor = 'move';
          relearningWindow.style.cursor = 'default';
        }
      };
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  // Relearning Hear window functionality
  if (relearningHearWindow && relearningHearTitleBar) {
    let isDraggingHear = false;
    let startXHear, startYHear, initialXHear, initialYHear;
    let mouseMovedHear = false;

    // Toggle window on title bar click
    relearningHearTitleBar.addEventListener('click', function(e) {
      if (e.target.tagName === 'BUTTON' || mouseMovedHear) {
        mouseMovedHear = false;
        return;
      }
      
      if (relearningHearWindow.classList.contains('minimized')) {
        relearningHearWindow.classList.remove('minimized');
        relearningHearWindow.style.height = '';
        relearningHearWindow.style.maxHeight = '90vh';
      } else {
        relearningHearWindow.classList.add('minimized');
        relearningHearWindow.style.height = '22px';
        relearningHearWindow.style.maxHeight = '22px';
      }
    });

    // Make relearning hear window draggable
    relearningHearTitleBar.addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'BUTTON') {
        return;
      }
      
      mouseMovedHear = false;
      const startMouseX = e.clientX;
      const startMouseY = e.clientY;
      
      const rect = relearningHearWindow.getBoundingClientRect();
      initialXHear = rect.left;
      initialYHear = rect.top;
      
      startXHear = e.clientX - initialXHear;
      startYHear = e.clientY - initialYHear;

      const onMouseMove = function(moveEvent) {
        const deltaX = Math.abs(moveEvent.clientX - startMouseX);
        const deltaY = Math.abs(moveEvent.clientY - startMouseY);
        
        if (deltaX > 5 || deltaY > 5) {
          mouseMovedHear = true;
          
          if (!isDraggingHear) {
            isDraggingHear = true;
            relearningHearTitleBar.style.cursor = 'grabbing';
            relearningHearWindow.style.cursor = 'grabbing';
          }
          
          const x = moveEvent.clientX - startXHear;
          const y = moveEvent.clientY - startYHear;

          const currentRect = relearningHearWindow.getBoundingClientRect();
          const maxX = window.innerWidth - currentRect.width;
          const maxY = window.innerHeight - currentRect.height;
          const constrainedX = Math.max(0, Math.min(x, maxX));
          const constrainedY = Math.max(0, Math.min(y, maxY));

          relearningHearWindow.style.right = 'auto';
          relearningHearWindow.style.left = `${constrainedX}px`;
          relearningHearWindow.style.top = `${constrainedY}px`;
        }
      };
      
      const onMouseUp = function() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        if (isDraggingHear) {
          isDraggingHear = false;
          relearningHearTitleBar.style.cursor = 'move';
          relearningHearWindow.style.cursor = 'default';
        }
      };
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  // Touch-friendly dropdown for mobile devices
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdown = document.querySelector('.dropdown');
  
  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', function(e) {
      e.preventDefault();
      dropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  }

  // ============================================
  // Touch-friendly EXIF metadata interactions
  // ============================================
  // Converts hover-style metadata to touch-friendly tap-to-toggle interactions
  // Works on all touch devices and persists after page updates
  // ============================================
  
  // Detect if device supports touch
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (isTouchDevice) {
    // Handle touch events for EXIF data on background images
    const landingBackgrounds = document.querySelectorAll('.landing-background');
    landingBackgrounds.forEach(background => {
      const exifData = background.querySelector('.exif-data');
      if (exifData) {
        let touchStartTime = 0;
        let touchMoved = false;
        
        background.addEventListener('touchstart', function(e) {
          touchStartTime = Date.now();
          touchMoved = false;
        }, { passive: true });
        
        background.addEventListener('touchmove', function(e) {
          touchMoved = true;
        }, { passive: true });
        
        background.addEventListener('touchend', function(e) {
          const touchDuration = Date.now() - touchStartTime;
          // Toggle EXIF on tap (not drag) - tap is < 300ms and no movement
          if (!touchMoved && touchDuration < 300) {
            e.preventDefault();
            exifData.classList.toggle('touch-visible');
          }
        }, { passive: false });
      }
    });

    // Handle touch events for EXIF data on photo figures
    const photoFigures = document.querySelectorAll('figure.photo');
    photoFigures.forEach(figure => {
      const exifData = figure.querySelector('.exif-data');
      if (exifData) {
        let touchStartTime = 0;
        let touchMoved = false;
        
        figure.addEventListener('touchstart', function(e) {
          touchStartTime = Date.now();
          touchMoved = false;
        }, { passive: true });
        
        figure.addEventListener('touchmove', function(e) {
          touchMoved = true;
        }, { passive: true });
        
        figure.addEventListener('touchend', function(e) {
          const touchDuration = Date.now() - touchStartTime;
          // Toggle EXIF on tap (not drag) - tap is < 300ms and no movement
          if (!touchMoved && touchDuration < 300) {
            e.preventDefault();
            exifData.classList.toggle('touch-visible');
          }
        }, { passive: false });
      }
    });
  }

  // About-me window functionality - only on landing page
  const landingSection = document.querySelector('#landing');
  const aboutMeWindow = landingSection ? landingSection.querySelector('.about-me-window') : null;
  
  if (aboutMeWindow) {
    // Initialize about-me window to start minimized
    aboutMeWindow.classList.add('minimized');
    
    // Make window draggable and minimizable (reuse existing window logic)
    const titleBar = aboutMeWindow.querySelector('.window-title-bar');
    const minimizeBtn = aboutMeWindow.querySelector('.window-minimize');
    
    if (titleBar) {
      let isDragging = false;
      let mouseMoved = false;
      let startX, startY, startLeft, startTop;
      
      titleBar.addEventListener('mousedown', function(e) {
        if (e.target.closest('.window-controls')) return;
        isDragging = true;
        mouseMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        const rect = aboutMeWindow.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        aboutMeWindow.style.transition = 'none';
        e.preventDefault();
      });
      
      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        mouseMoved = true;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        aboutMeWindow.style.left = (startLeft + deltaX) + 'px';
        aboutMeWindow.style.top = (startTop + deltaY) + 'px';
      });
      
      document.addEventListener('mouseup', function() {
        if (isDragging) {
          isDragging = false;
          aboutMeWindow.style.transition = '';
          if (!mouseMoved) {
            // Click without drag - toggle minimize
            aboutMeWindow.classList.toggle('minimized');
          }
        }
        mouseMoved = false;
      });
      
      // Minimize button click
      if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          aboutMeWindow.classList.toggle('minimized');
        });
      }
    }
  }
});
