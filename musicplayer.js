const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playlist = $('.playlist')
const audio = $('#audio')
const heading = $('header h2')
const cdPicture = $('.cd-thumb')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const PLAYER_STORAGE_KEY = "mode_music_player"



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            id: 0,
            name: "Đế Vương",
            author: "Đình Dũng, ACV",
            image: "./assets/img/devuong.jpg",
            path: "./assets/music/devuong.mp3"
        },
        {
            id: 1,
            name: "Thức Giấc",
            author: "DaLab",
            image: "./assets/img/thucgiac.jpg",
            path: "./assets/music/thucgiac.mp3"
        },
        {
            id: 2,
            name: "Ái Nộ",
            author: "Masew,Khôi Vũ",
            image: "./assets/img/aino.jpg",
            path: "./assets/music/aino.mp3"
        },
        {
            id: 3,
            name: "Phải chăng em đã yêu",
            author: "JuckySan,RedT",
            image: "./assets/img/phaichangemdayeu.jpg",
            path: "./assets/music/phaichangemdayeu.mp3"
        },
        {
            id: 4,
            name: "Thức Giấc",
            author: "DaLab",
            image: "./assets/img/thucgiac.jpg",
            path: "./assets/music/thucgiac.mp3"
        },
        {
            id: 5,
            name: "Ái Nộ",
            author: "Masew,Khôi Vũ",
            image: "./assets/img/aino.jpg",
            path: "./assets/music/aino.mp3"
        },
        {
            id: 6,
            name: "Thức Giấc",
            author: "DaLab",
            image: "./assets/img/thucgiac.jpg",
            path: "./assets/music/thucgiac.mp3"
        },
        {
            id: 7,
            name: "Ái Nộ",
            author: "Masew,Khôi Vũ",
            image: "./assets/img/aino.jpg",
            path: "./assets/music/aino.mp3"
        }

    ],
    render() {
        const htmls = this.songs.map(function (song, index) {
            return `
            <div class="song" data-index ="${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.author}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        const cdPictureAnimate = cdPicture.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 5000,
            iterations: Infinity
        })
        cdPictureAnimate.pause()
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdPictureAnimate.play()

        }
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdPictureAnimate.pause()
        }
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
                progress.value = progressPercent
            }

        }
        progress.oninput = function (e) {
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime
        }
        nextBtn.onclick = function () {
            _this.removeActiveSong()
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextsong()
            }
            _this.activeSong()
            audio.play()
            _this.PlistScrollIntoView()
        }
        prevBtn.onclick = function () {
            _this.removeActiveSong()
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevsong()
            }
            _this.activeSong()
            audio.play()
            _this.PlistScrollIntoView()

        }
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)

        }
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()

            }
        }
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                //Xử lý khi bấm vào song
                if (songNode) {
                    _this.removeActiveSong()
                    _this.currentIndex = Number(songNode.getAttribute('data-index'))
                    _this.activeSong()
                    _this.loadCurrentSong()
                    audio.play()
                }
                //Xử lý khi bấm vào option
                if (e.target.closest('.option')) {

                }

            }
        }

    },
    activeSong() {
        $(`.song:nth-child(${this.currentIndex + 1})`).classList.add('active')
    },
    removeActiveSong() {
        $('.song.active').classList.remove('active')
        // $(`.song:nth-child(${this.currentIndex + 1})`).classList.remove('active')
    },
    PlistScrollIntoView() {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 300)
    },

    nextsong() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevsong() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    indexSongs: [],
    playRandomSong() {
        let newIndex
        if (this.indexSongs.length === this.songs.length) {
            this.indexSongs = []
        }
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)

        } while (this.indexSongs.includes(newIndex) || newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.indexSongs.push(newIndex)
        this.loadCurrentSong()

    },
    loadConfig() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)

    },

    loadCurrentSong() {


        heading.textContent = this.currentSong.name
        cdPicture.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path


    },
    start: function () {
        this.loadConfig()
        //Định nghĩa new property 
        this.defineProperties()
        //Lắng nghe sự kiện 
        this.handleEvent()
        //Load Song
        this.loadCurrentSong()
        //Render
        this.render()
        //Active
        this.activeSong()


    }
}

app.start()