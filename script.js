const playlist = [
    {
        title: "Industrial Zone",
        artist: "Ozzed",
        src: "https://cdn.jsdelivr.net/gh/groovecrusher/music/ozzed_crystal_caves/1_industrial_zone.mp3",
        duration: 2:17
    },
    {
        title: "Rocky Caves",
        artist: "Ozzed",
        src: "https://cdn.jsdelivr.net/gh/groovecrusher/music/ozzed_crystal_caves/2_rocky_caves.mp3",
        duration: 2:05
    },
    {
        title: "Dance of the Droids",
        artist: "Ozzed",
        src: "https://cdn.jsdelivr.net/gh/groovecrusher/music/ozzed_crystal_caves/3_dance_of_the_droids.mp3",
        duration: 2:30
    },
    {
        title: "Bog of Despair",
        artist: "Ozzed",
        src: "https://cdn.jsdelivr.net/gh/groovecrusher/music/ozzed_crystal_caves/4_bog_of_despair.mp3",
        duration: 2:10
    },
    {
        title: "Lava World",
        artist: "Ozzed",
        src: "https://cdn.jsdelivr.net/gh/groovecrusher/music/ozzed_crystal_caves/5_lava_world.mp3",
        duration: 2:45
    },
    {
        title: "Crystal Caves",
        artist: "Ozzed",
        src: "https://cdn.jsdelivr.net/gh/groovecrusher/music/ozzed_crystal_caves/6_crystal_caves.mp3",
        duration: 2:20
    },
    {
        title: "End of the Line",
        artist: "Ozzed",
        src: "https://cdn.jsdelivr.net/gh/groovecrusher/music/ozzed_crystal_caves/7_end_of_the_line.mp3",
        duration: 2:00
    },
    {
        title: "Underground City",
        artist: "Ozzed",
        src: "https://cdn.jsdelivr.net/gh/groovecrusher/music/ozzed_crystal_caves/8_underground_city.mp3",
        duration: 2:15
    },
    {
        title: "The End",
        artist: "Ozzed",
        src: "https://cdn.jsdelivr.net/gh/groovecrusher/music/ozzed_crystal_caves/9_the_end.mp3",
        duration: 1:45
    },
    {
        title: "Boss Battle",
        artist: "Ozzed",
        src: "https://cdn.jsdelivr.net/gh/groovecrusher/music/ozzed_crystal_caves/10_boss_battle.mp3",
        duration: 2:35
    },
    {
        title: "Victory",
        artist: "Ozzed",
        src: "https://cdn.jsdelivr.net/gh/groovecrusher/music/ozzed_crystal_caves/11_victory.mp3",
        duration: 1:55
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isLoop = false;
let audioCtx, analyser, source, dataArray, canvas, ctx;

document.addEventListener('DOMContentLoaded', init);

function init() {
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const loopBtn = document.getElementById('loop-btn');
    const seekBar = document.getElementById('seek-bar');
    const timeDisplay = document.getElementById('time-display');

    loadPlaylist();
    loadTrack(currentTrackIndex);

    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrev);
    nextBtn.addEventListener('click', playNext);
    shuffleBtn.addEventListener('click', toggleShuffle);
    loopBtn.addEventListener('click', toggleLoop);

    seekBar.addEventListener('input', (e) => {
        const percent = e.target.value / 100;
        audio.currentTime = percent * audio.duration;
    });

    audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.duration)) {
            const percent = (audio.currentTime / audio.duration) * 100;
            seekBar.value = percent;
            timeDisplay.textContent = formatTime(audio.currentTime);
        }
    });

    audio.addEventListener('ended', () => {
        if (isLoop) {
            audio.play();
        } else {
            playNext();
        }
    });

    initVisualizer();
    startVisualization();
}

function loadPlaylist() {
    const playlistEl = document.getElementById('playlist');
    playlistEl.innerHTML = '';

    playlist.forEach((track, index) => {
        const trackEl = document.createElement('div');
        trackEl.className = 'track';
        trackEl.dataset.index = index;
        trackEl.innerHTML = `
            <span class="track-number">${index + 1}</span>
            <div class="track-info">
                <div class="track-title">${track.title}</div>
                <div class="track-duration">${track.duration}</div>
            </div>
        `;
        trackEl.addEventListener('click', () => loadTrack(index));
        playlistEl.appendChild(trackEl);
    });
}

function loadTrack(index) {
    const audio = document.getElementById('audio');
    const track = playlist[index];
    currentTrackIndex = index;

    audio.src = track.src;
    audio.load();

    updateNowPlaying(track);
    updateActiveTrack(index);

    play();
}

function updateNowPlaying(track) {
    document.getElementById('track-title').textContent = track.title;
    document.getElementById('track-artist').textContent = track.artist;
}

function updateActiveTrack(index) {
    const tracks = document.querySelectorAll('.track');
    tracks.forEach((track, i) => {
        if (i === index) {
            track.classList.add('active');
        } else {
            track.classList.remove('active');
        }
    });
}

function togglePlay() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

function play() {
    const audio = document.getElementById('audio');
    audio.play();
    isPlaying = true;
    document.getElementById('play-pause-btn').textContent = '⏸';
}

function pause() {
    const audio = document.getElementById('audio');
    audio.pause();
    isPlaying = false;
    document.getElementById('play-pause-btn').textContent = '▶';
}

function playPrev() {
    let index = currentTrackIndex - 1;
    if (index < 0) {
        index = playlist.length - 1;
    }
    loadTrack(index);
}

function playNext() {
    let index;
    if (isShuffle) {
        index = Math.floor(Math.random() * playlist.length);
    } else {
        index = currentTrackIndex + 1;
        if (index >= playlist.length) {
            index = 0;
        }
    }
    loadTrack(index);
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    document.getElementById('shuffle-btn').classList.toggle('active', isShuffle);
}

function toggleLoop() {
    isLoop = !isLoop;
    document.getElementById('loop-btn').classList.toggle('active', isLoop);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function initVisualizer() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    canvas = document.getElementById('visualizer');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx = canvas.getContext('2d');

    const audio = document.getElementById('audio');
    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    dataArray = new Uint8Array(analyser.frequencyBinCount);
}

function startVisualization() {
    const draw = () => {
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgba(10, 10, 46, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / dataArray.length) * 0.6;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;

            ctx.fillStyle = `hsl(${180 + (i / dataArray.length) * 180}, 100%, 50%)`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 2;
        }

        requestAnimationFrame(draw);
    };

    draw();
}

window.addEventListener('resize', () => {
    if (canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
});