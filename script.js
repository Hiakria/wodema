function initHomePage() {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    
    var targetPageId = 'home';
    
    pages.forEach(page => page.classList.remove('active'));
    const homePage = document.getElementById('home');
    if (homePage) {
        homePage.classList.add('active');
    }
    
    navLinks.forEach(link => link.classList.remove('active'));
    const homeLink = document.querySelector('.nav-link[data-page="home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
    
    const sakuraCanvas = document.getElementById('sakura');
    if (sakuraCanvas) {
        sakuraCanvas.style.display = 'block';
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function() {
    initHomePage();
    
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const menuToggle = document.getElementById('menuToggle');
    const navbar = document.querySelector('.navbar');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    function switchPage(pageName) {
        pages.forEach(page => page.classList.remove('active'));
        
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        const sakuraCanvas = document.getElementById('sakura');
        if (sakuraCanvas) {
            sakuraCanvas.style.display = (pageName === 'home') ? 'block' : 'none';
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchPage(this.getAttribute('data-page'));
        });
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchPage(this.getAttribute('data-page'));
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        navbar.style.boxShadow = currentScroll > 0 
            ? '0 4px 30px rgba(0, 0, 0, 0.1)' 
            : '0 2px 20px rgba(0, 0, 0, 0.05)';
    });

    document.querySelectorAll('.work-card').forEach(card => {
        card.addEventListener('click', function() {
            switchPage('portfolio');
        });
    });

    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.download-btn');
        if (btn) {
            e.stopPropagation();
            const card = btn.closest('.portfolio-card');
            if (card) {
                const cardIndex = Array.from(document.querySelectorAll('.portfolio-card')).indexOf(card);
                window.location.href = `work-detail.html?id=${cardIndex + 1}`;
            }
        }
    });

    const navCTA = document.querySelector('.nav-cta');
    if (navCTA) {
        navCTA.addEventListener('click', function(e) {
            e.preventDefault();
            switchPage('contact');
        });
    }

    document.querySelector('.btn-primary')?.addEventListener('click', function(e) {
        e.preventDefault();
        switchPage('portfolio');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById('tab-' + tabName)?.classList.add('active');
        });
    });

    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const nextBtn = document.querySelector('.control-btn.next');
    const prevBtn = document.querySelector('.control-btn.prev');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const cd = document.querySelector('.cd');
    const lyricsContent = document.getElementById('lyricsContent');
    let lyricLines = document.querySelectorAll('.lyric-line');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const songTitle = document.querySelector('.player-song-title') || document.querySelector('.song-title');
    const songArtist = document.querySelector('.player-song-artist') || document.querySelector('.song-artist');
    let isPlaying = false;
    let currentTrackIndex = 0;

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateProgress() {
        if (audioPlayer && audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressFill.style.width = `${progress}%`;
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        }
    }

    function updateLyrics() {
        if (!audioPlayer || !lyricsContent) return;
        
        const currentTime = audioPlayer.currentTime;
        let activeIndex = -1;
        let nextIndex = -1;
        let latestTime = -1;
        let nextTime = Infinity;
        
        for (let i = 0; i < lyricLines.length; i++) {
            const time = parseFloat(lyricLines[i].getAttribute('data-time'));
            if (time !== undefined) {
                if (time <= currentTime && time > latestTime) {
                    activeIndex = i;
                    latestTime = time;
                }
                if (time > currentTime && time < nextTime) {
                    nextIndex = i;
                    nextTime = time;
                }
            }
        }
        
        lyricLines.forEach(line => line.classList.remove('active'));
        
        if (activeIndex >= 0) {
            lyricLines[activeIndex].classList.add('active');
            
            let targetIndex = activeIndex;
            
            if (nextIndex > 0) {
                const timeDiff = nextTime - currentTime;
                
                if (timeDiff < 5) {
                    targetIndex = nextIndex;
                }
            }
            
            const targetLine = lyricLines[targetIndex];
            const container = lyricsContent;
            const lineTop = targetLine.offsetTop;
            const lineHeight = targetLine.offsetHeight;
            const containerHeight = container.offsetHeight;
            const scrollHeight = container.scrollHeight;
            
            let targetScrollTop = lineTop - containerHeight / 2 + lineHeight / 2;
            targetScrollTop = Math.max(0, Math.min(targetScrollTop, scrollHeight - containerHeight));
            
            container.scrollTop = targetScrollTop;
        }
    }

    if (audioPlayer && playBtn) {
        audioPlayer.addEventListener('loadedmetadata', function() {
            durationEl.textContent = formatTime(audioPlayer.duration);
        });

        audioPlayer.addEventListener('timeupdate', function() {
            updateProgress();
            updateLyrics();
        });

        audioPlayer.addEventListener('ended', function() {
            isPlaying = false;
            playBtn.textContent = '▶';
            cd.style.animationPlayState = 'paused';
        });

        playBtn.addEventListener('click', function() {
            if (isPlaying) {
                audioPlayer.pause();
                playBtn.textContent = '▶';
                cd.style.animationPlayState = 'paused';
            } else {
                audioPlayer.play();
                playBtn.textContent = '⏸';
                cd.style.animationPlayState = 'running';
            }
            isPlaying = !isPlaying;
        });

        progressBar.addEventListener('click', function(e) {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            if (audioPlayer && audioPlayer.duration) {
                audioPlayer.currentTime = percent * audioPlayer.duration;
                updateProgress();
                updateLyrics();
            }
        });

        function switchTrack(index) {
            if (index < 0 || index >= playlistItems.length) return;
            
            const item = playlistItems[index];
            const title = item.querySelector('.track-title').textContent;
            const artist = item.querySelector('.track-artist').textContent;
            const audioSrc = item.getAttribute('data-audio') || 'images/嘉宾.mp3';
            
            audioPlayer.src = audioSrc;
            currentTrackIndex = index;
            
            if (songTitle) songTitle.textContent = title;
            if (songArtist) songArtist.textContent = artist;
            
            playlistItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
            
            if (index === 0) {
                showGuestLyrics();
            } else {
                showNoLyrics(title, artist);
            }
            
            audioPlayer.load();
            if (isPlaying) {
                audioPlayer.play();
            }
        }

        function showGuestLyrics() {
            if (!lyricsContent) return;
            lyricsContent.innerHTML = `
                <div class="lyric-line">嘉宾</div>
                <div class="lyric-line">管智超</div>
                <div class="lyric-line" data-time="15">分手后第几个冬季</div>
                <div class="lyric-line" data-time="19">今天是星期几</div>
                <div class="lyric-line" data-time="22">偶尔会想起你</div>
                <div class="lyric-line" data-time="26">你突如其来的简讯</div>
                <div class="lyric-line" data-time="31">让我措手不及</div>
                <div class="lyric-line" data-time="35">愣住站在原地</div>
                <div class="lyric-line" data-time="39">当所有人都替你开心</div>
                <div class="lyric-line" data-time="44">我却才傻傻清醒</div>
                <div class="lyric-line" data-time="46">原来早已有人为你订做了嫁衣</div>
                <div class="lyric-line" data-time="51">感谢你特别邀请</div>
                <div class="lyric-line" data-time="55">来见证你的爱情</div>
                <div class="lyric-line" data-time="58">我时刻提醒自己 别逃避</div>
                <div class="lyric-line" data-time="64">拿着喜帖一步一步走近</div>
                <div class="lyric-line" data-time="68">他精心布置的场地</div>
                <div class="lyric-line" data-time="71">可惜这是属于你的风景</div>
                <div class="lyric-line" data-time="75">而我只是嘉宾</div>
                <div class="lyric-line" data-time="77">我放下所有回忆</div>
                <div class="lyric-line" data-time="80">来成全你的爱情</div>
                <div class="lyric-line" data-time="83">却始终不愿相信 这是命</div>
                <div class="lyric-line" data-time="89">好久不见的你有点疏离</div>
                <div class="lyric-line" data-time="93">握手寒暄如此客气</div>
                <div class="lyric-line" data-time="97">何必要在他的面前刻意</div>
                <div class="lyric-line" data-time="100">隐瞒我的世界 有过你</div>
                <div class="lyric-line" data-time="115">不知不觉钟声响起</div>
                <div class="lyric-line" data-time="121">你守候在原地</div>
                <div class="lyric-line" data-time="124">等待着他靠近</div>
                <div class="lyric-line" data-time="128">温柔的他单膝跪地</div>
                <div class="lyric-line" data-time="134">钻戒缓缓戴进</div>
                <div class="lyric-line" data-time="137">你的无名指里</div>
                <div class="lyric-line" data-time="141">当所有人都替你开心</div>
                <div class="lyric-line" data-time="146">我却才傻傻清醒</div>
                <div class="lyric-line" data-time="148">原来我们之间已没有任何关系</div>
                <div class="lyric-line" data-time="154">感谢你特别邀请</div>
                <div class="lyric-line" data-time="157">来见证你的爱情</div>
                <div class="lyric-line" data-time="166">我时刻提醒自己 别逃避</div>
                <div class="lyric-line" data-time="170">今天你妆扮得格外美丽</div>
                <div class="lyric-line" data-time="173">这美也曾拥在怀里</div>
                <div class="lyric-line" data-time="177">可惜这是你和他的婚礼</div>
                <div class="lyric-line" data-time="180">而我只是嘉宾</div>
                <div class="lyric-line" data-time="183">我放下所有回忆</div>
                <div class="lyric-line" data-time="186">来成全你的爱情</div>
                <div class="lyric-line" data-time="191">却始终不愿相信 这是命</div>
                <div class="lyric-line" data-time="195">说好的永远变成了曾经</div>
                <div class="lyric-line" data-time="199">我试着衷心祝福你</div>
                <div class="lyric-line" data-time="202">请原谅我不体面没出息</div>
                <div class="lyric-line" data-time="209">选择失陪一下 先离席</div>
                <div class="lyric-line" data-time="213">又不是偶像剧</div>
                <div class="lyric-line" data-time="218">怎么我演得那么入戏</div>
                <div class="lyric-line" data-time="224">这不堪入目的剧情</div>
                <div class="lyric-line" data-time="227">感谢你特别邀请</div>
                <div class="lyric-line" data-time="231">观赏你要的爱情</div>
                <div class="lyric-line" data-time="236">嘉宾也许是另一种宿命</div>
                <div class="lyric-line" data-time="240">离开你的自己事到如今</div>
                <div class="lyric-line" data-time="244">还有什么资格关心</div>
                <div class="lyric-line" data-time="248">毕竟终成眷属的人是你</div>
                <div class="lyric-line" data-time="250">而我只是嘉宾</div>
                <div class="lyric-line" data-time="253">我流尽所有回忆</div>
                <div class="lyric-line" data-time="256">来庆祝你的婚礼</div>
                <div class="lyric-line" data-time="262">却始终没有勇气 祝福你</div>
                <div class="lyric-line" data-time="266">谢谢你送给我最后清醒</div>
                <div class="lyric-line" data-time="272">把自己还给我自己</div>
                <div class="lyric-line" data-time="277">至少我还能够成为那个</div>
                <div class="lyric-line" data-time="282">见证你们爱情的嘉宾</div>
            `;
            lyricsContent.scrollTop = 0;
            updateLyricLines();
        }

        function showNoLyrics(title, artist) {
            if (!lyricsContent) return;
            lyricsContent.innerHTML = `
                <div class="lyric-line">${title || '未知歌曲'}</div>
                <div class="lyric-line">${artist || '未知歌手'}</div>
                <div class="lyric-line" style="color: #999; font-size: 16px; padding-top: 60px;">暂无歌词</div>
            `;
            lyricsContent.scrollTop = 0;
        }

        function updateLyricLines() {
            lyricLines = document.querySelectorAll('.lyric-line');
        }

        nextBtn?.addEventListener('click', function() {
            const nextIndex = (currentTrackIndex + 1) % playlistItems.length;
            switchTrack(nextIndex);
        });

        prevBtn?.addEventListener('click', function() {
            const prevIndex = (currentTrackIndex - 1 + playlistItems.length) % playlistItems.length;
            switchTrack(prevIndex);
        });

        playlistItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                switchTrack(index);
            });
        });
    }

    document.querySelector('.btn-secondary')?.addEventListener('click', function(e) {
        e.preventDefault();
        switchPage('contact');
    });

    console.log('设计师个人网站已加载完成 ✨');
});