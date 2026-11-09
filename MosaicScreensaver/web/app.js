const displayMode = typeof window.displayMode !== 'undefined' ? window.displayMode : 2; // 0=Music, 1=Movie, 2=Mixed, 3=Books, 4=All Mixed
const animationType = typeof window.animationType !== 'undefined' ? window.animationType : 0; // 0=Flip, 1=Flow
const bookLanguage = typeof window.bookLanguage !== 'undefined' ? window.bookLanguage : 0; // 0=Chinese, 1=All

const musicGenres = window.selectedMusicGenres && window.selectedMusicGenres.length > 0 ? window.selectedMusicGenres : ['Pop', 'Rock', 'Jazz', 'Classical', 'Electronic'];
const configuredRows = Number.isInteger(window.rowCount) && window.rowCount >= 1 && window.rowCount <= 20 ? window.rowCount : 0;
const movieGenres = window.selectedMovieGenres && window.selectedMovieGenres.length > 0 ? window.selectedMovieGenres : ['Action', 'Comedy', 'Sci-Fi', 'Drama', 'Adventure'];

// 80+ high quality diverse default music album covers (Pop, Rock, EDM, Jazz, Soundtrack, Hip-Hop, Classical)
const defaultMusicArtworks = [
    "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4a/0c/3e/4a0c3e60-fef0-be2a-5a50-6a1005a76e73/196626943960.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a6/6e/bf/a66ebf79-5008-8948-b352-a790fc87446b/19UM1IM04638.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/ec/f5/45/ecf545c0-24bd-90de-7639-3069e648c51d/075679804938.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e1/15/42/e1154273-8ecd-5702-e6e6-597f28001681/25UMGIM82363.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/27/94/d4/2794d4fc-c3e2-2373-3e6c-dd82fd5aefe6/18UMGIM18200.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a6/63/54/a6635418-7d49-b237-d1c9-ba85fa57dbc6/075679886613.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/fe/66/14/fe66145c-430e-f7a0-e5ce-8e8e5be19c89/888915747841.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/cf/66/73/cf6673b8-b936-dc2e-4f9c-75595eb545b2/075679791344.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2a/19/fb/2a19fb85-2f70-9e44-f2a9-82abe679b88e/886449990061.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/46/fe/4a/46fe4a39-feb4-7b8b-97b9-0187d49a46bd/19UMGIM53914.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2b/c4/c9/2bc4c9d4-3bc6-ab13-3f71-df0b89b173de/886448022213.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1a/7e/42/1a7e428a-4449-b613-46c3-5fa75d83047a/00602567702023.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/47/5a/22/475a22e9-df22-4fca-06c5-8f6e8a42e012/054391860224.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d0/cf/22/d0cf226c-607d-d97c-61d4-26eabde51f1d/886443002371_Cover.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/97/8d/6c/978d6ca1-3f18-95d5-3980-f8a437f6a318/17UM1IM21176.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/1f/1d/de/1f1ddefb-41c5-0bd7-5146-b1faffcd2937/19UMGIM64565.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/80/bb/18/80bb1895-326f-e618-9aa8-d2338bb35f0c/842812106569_Cover.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fa/60/fe/fa60fe4a-4329-a0bb-eb7c-3b6094a4d831/25UMGIM46049.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/60/6c/98/606c98cd-64ad-95d9-ec4d-41249ba667a2/00602455039392_Cover.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e2/4b/60/e24b6016-8278-bb18-cf5d-d44bf68371da/00602547223838.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ad/d0/ed/add0ed5b-bf41-312c-4c32-614f9c76e71b/723277880365.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4c/b6/e5/4cb6e5b1-2db0-88c0-f025-b79cad3b8fab/196873832111.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/e8/f3/b9/e8f3b9fd-979c-7def-e314-13a021dea301/075679711694.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/08/2a/4d082a9e-7898-1aa1-a02f-339810058d9e/14DMGIM05632.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9a/3a/26/9a3a2608-29a7-5585-f990-cdfeb10b7394/075679955005.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/30/75/5b/30755bfd-3225-8a60-ac85-0cf74876f84e/18UMGIM84859.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/f5/b1/26f5b198-9f2b-2c8c-749f-13f4f95e9d89/25UM1IM35684.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/02/17/78/021778f3-9c1f-e211-30b6-854109b992ae/196871996808.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/11/7a/b8/117ab805-6811-8929-18b9-0fad7baf0c25/17UMGIM98210.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/aa/2b/b9/aa2bb92a-4ace-da16-5118-21b78935e185/829619167054.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/83/56/da/8356dadb-17a7-1d40-f8ed-53f934224532/886448054825.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/d2/48/f4/d248f4ae-a7e4-a48e-1588-6617de3e8d76/mzi.izeorbmm.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/ff/6d/94/ff6d948d-ca8c-5c88-a0ab-e9913377269c/653738041823_Cover.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/cb/7b/a9/cb7ba903-b5f1-cc21-90db-7a81b7aa0997/724596951057.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/8e/13/bd8e1358-b367-a689-cb84-cebd0b067dc4/634904078263.png/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ac/b3/16/acb31671-10a6-21e1-2380-ddf7b3b796cc/24UM1IM21808.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7e/9f/21/7e9f21e5-1da2-395d-9312-6499c31b75d1/886448328568.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e5/08/90/e50890a8-205e-a810-dcda-44b614f99f5f/00602557442878.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/70/03/af/7003af31-bfca-ee48-07e7-13dd7301a383/0617465613456.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c0/54/97/c05497aa-c19f-bf4f-de29-71edf30fbefb/075679688767.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/aa/5f/d8/aa5fd889-4c2e-7e24-e8b2-428beaf9d4fe/SWEATA009.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/82/72/d5/8272d5ad-49b7-f80a-59ec-0160215d2b86/886447616925.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/65/e3/e7/65e3e740-b69f-f5cb-f2e6-7dedb5265ac9/19UMGIM96748.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/76/5d/55/765d554e-e421-0299-783f-d78ad559d5e5/5021392959191.png/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/76/e3/a6/76e3a6dc-9d6a-d896-6fce-064b743545e9/cover.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/02/d9/f2/02d9f2ea-f95e-c67a-21ae-9bcee5bdd551/886447284360.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/91/7c/2b/917c2ba3-c97c-2807-2c18-b7794ebe5310/190296846489.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9b/77/5a/9b775a48-2a50-863f-e81f-6455685ffcfa/653738034528_Cover.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/51/14/e8/5114e83a-4de2-f0e8-9478-7324b3063d19/19UMGIM80656.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/82/6d/bd/826dbd0c-756b-30c4-140d-4937308cd6da/2784.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/14/50/c8/1450c820-3cb3-ac9f-1bbf-0137d4344452/093624903192.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/78/78/26/787826db-71b8-b179-43a4-badf3b69ad12/843357195377_01_img001.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/f3/26/a5/f326a578-f5fd-2065-a043-4c361d57d551/15UMGIM26562.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c5/8b/17/c58b1715-fe34-7d9b-ba41-ad109c1d2b51/8176930285434.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e9/a6/6b/e9a66bc9-b3cb-bb45-dcc8-8c9b5ad50a41/3149028144499_cover.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/90/71/b4/9071b497-8617-6abc-40d2-523e7222738b/22CRGIM31790.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3c/e3/da/3ce3da3c-74db-f61d-3e2c-ed8a5e41c7c0/13UAAIM70322.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2f/50/32/2f5032ef-2481-019a-0310-70942dace8c9/886449464326.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/f4/a9/54/f4a95477-c6c6-1c90-d7d3-f2e9889fa390/014998422553.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e8/83/ea/e883eade-52e2-fa74-fd1e-a69c114ef9ae/12CMGIM34347.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/fe/19/b1/fe19b168-8cd6-c583-515c-e168828b593e/14DMGIM05551.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/63/5a/8a/635a8a06-5b2a-e66f-f4a6-1827a994c86b/789577221895.png/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/31/8e/d1/318ed180-c0f4-922e-d875-0c4639f052d2/14DMGIM05603.rgb.jpg/600x600bb.jpg",
    "https://is1-ssl.mzstatic.com/image/thumb/Music/7f/9f/d6/mzi.vtnaewef.jpg/600x600bb.jpg"
];

const defaultMovieArtworks = [
    "https://static.tvmaze.com/uploads/images/original_untouched/425/1064746.jpg",
    "https://static.tvmaze.com/uploads/images/original_untouched/425/1064747.jpg",
    "https://static.tvmaze.com/uploads/images/original_untouched/12/31612.jpg",
    "https://static.tvmaze.com/uploads/images/original_untouched/402/1005823.jpg",
    "https://static.tvmaze.com/uploads/images/original_untouched/4/10310.jpg",
    "https://static.tvmaze.com/uploads/images/original_untouched/4/10311.jpg",
    "https://static.tvmaze.com/uploads/images/original_untouched/0/1.jpg",
    "https://static.tvmaze.com/uploads/images/original_untouched/0/2.jpg",
    "https://static.tvmaze.com/uploads/images/original_untouched/0/3.jpg",
    "https://static.tvmaze.com/uploads/images/original_untouched/0/4.jpg",
    "https://static.tvmaze.com/uploads/images/original_untouched/0/5.jpg",
    "https://static.tvmaze.com/uploads/images/original_untouched/0/6.jpg",
    "https://static.tvmaze.com/uploads/images/original_untouched/0/7.jpg",
    "https://static.tvmaze.com/uploads/images/original_untouched/0/8.jpg"
];

// Initialize artworks with shuffled rich defaults
let musicArtworks = [...(window.localMusicArtworks || [])].sort(() => Math.random() - 0.5);
let movieArtworks = [...defaultMovieArtworks].sort(() => Math.random() - 0.5);
let bookArtworks = ['https://covers.openlibrary.org/b/id/8259441-L.jpg', 'https://covers.openlibrary.org/b/id/8259442-L.jpg'];

// Load cached artworks immediately if available
try {
    const cachedMusic = JSON.parse(localStorage.getItem('cachedMusicArtworksV5'));
    const cachedMovie = JSON.parse(localStorage.getItem('cachedMovieArtworksV5'));
    const cachedBook = JSON.parse(localStorage.getItem('cachedBookArtworksV5'));
    // Music always comes from the current local Apple Music library.
    if (cachedMovie && cachedMovie.length >= 10) movieArtworks = cachedMovie;
    if (cachedBook && cachedBook.length >= 10) bookArtworks = cachedBook;
} catch (e) {}

const activeArtworks = new Set();
let tiles = [];
let cols = 0;
let rows = 0;

async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 3000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal  
        });
        clearTimeout(id);
        return response;
    } catch (err) {
        clearTimeout(id);
        throw err;
    }
}

async function fetchArtworks() {
    const now = Date.now();
    // Music covers come only from Apple Music's local indexed cache.

    // Movie Fetch
    if (displayMode === 1 || displayMode === 2 || displayMode === 4) {
        const pages = [Math.floor(Math.random() * 15) + 1, Math.floor(Math.random() * 15) + 16];
        const moviePromises = pages.map(page => 
            fetchWithTimeout(`https://api.tvmaze.com/shows?page=${page}`, { timeout: 3500 })
                .then(res => res.json())
                .catch(() => [])
        );
        const results = await Promise.allSettled(moviePromises);
        const seenMovie = new Set(movieArtworks);
        const newMovies = [];
        results.forEach(r => {
            if (r.status === 'fulfilled' && Array.isArray(r.value)) {
                r.value.forEach(show => {
                    const matchesGenre = movieGenres.some(g => {
                        if (g.toLowerCase() === 'chinese') {
                            return (show.network && show.network.country && show.network.country.code === 'CN') ||
                                   (show.webChannel && show.webChannel.country && show.webChannel.country.code === 'CN') ||
                                   (show.language && show.language.toLowerCase() === 'chinese');
                        }
                        return show.genres && show.genres.some(sg => sg.toLowerCase() === g.toLowerCase());
                    });
                    if (matchesGenre && show.image) {
                        const imgUrl = show.image.original || show.image.medium;
                        if (!seenMovie.has(imgUrl)) {
                            seenMovie.add(imgUrl);
                            newMovies.push(imgUrl);
                        }
                    }
                });
            }
        });
        if (newMovies.length > 0) {
            movieArtworks = [...newMovies.sort(() => Math.random() - 0.5), ...movieArtworks];
            try {
                localStorage.setItem('cachedMovieArtworksV5', JSON.stringify(movieArtworks.slice(0, 300)));
            } catch(e) {}
        }
    }

    // Books Fetch
    if (displayMode === 3 || displayMode === 4) {
        await fetchBookArtworks();
    }
}

async function fetchBookArtworks() {
    try {
        const bookLang = typeof window.bookLanguage !== 'undefined' ? window.bookLanguage : 0;
        if (bookLang === 0) {
            // Local curated covers
            for (let i = 0; i < 971; i++) {
                bookArtworks.push(`covers/${i}.jpg`);
            }
        } else {
            const pages = [Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 11];
            const bookPromises = pages.map(page => 
                fetchWithTimeout(`https://openlibrary.org/search.json?q=subject:fiction&limit=50&page=${page}`, { timeout: 3500 })
                    .then(res => res.json())
                    .catch(() => ({}))
            );
            const results = await Promise.allSettled(bookPromises);
            const seenBooks = new Set(bookArtworks);
            results.forEach(r => {
                if (r.status === 'fulfilled' && r.value && r.value.docs) {
                    r.value.docs.forEach(doc => {
                        if (doc.cover_i) {
                            const bUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
                            if (!seenBooks.has(bUrl)) {
                                seenBooks.add(bUrl);
                                bookArtworks.push(bUrl);
                            }
                        }
                    });
                }
            });
        }
        if (bookArtworks.length > 0) {
            bookArtworks = bookArtworks.sort(() => Math.random() - 0.5);
            try {
                localStorage.setItem('cachedBookArtworksV5', JSON.stringify(bookArtworks.slice(0, 300)));
            } catch(e) {}
        }
    } catch (err) {}
}

// Guaranteed NO DUPLICATES on screen: selects from pool items not currently in activeArtworks
function getRandomArtwork(type, previousUrl) {
    let pool = [];
    if (type === 'music') pool = musicArtworks;
    else if (type === 'movie') pool = movieArtworks;
    else if (type === 'book') pool = bookArtworks;
    else pool = [...musicArtworks, ...movieArtworks, ...bookArtworks];

    if (pool.length === 0) return '';
    
    // Filter for candidates that are NOT currently displayed anywhere on the screen
    let available = pool.filter(url => !activeArtworks.has(url));
    if (available.length === 0) {
        available = pool; // gracefully reuse if pool is smaller than screen tiles count
    }

    const candidate = available[Math.floor(Math.random() * available.length)];

    if (previousUrl) {
        activeArtworks.delete(previousUrl);
    }
    activeArtworks.add(candidate);
    return candidate;
}

function getGridTypes() {
    if (displayMode === 0) return ['music'];
    if (displayMode === 1) return ['movie'];
    if (displayMode === 2) return ['music', 'movie'];
    if (displayMode === 3) return ['book'];
    return ['music', 'movie', 'book']; // 4
}

function initFlipGrid() {
    const container = document.getElementById('mosaic-container');
    container.innerHTML = '';
    container.className = 'mosaic-container flip-mode';
    tiles = [];

    const width = window.innerWidth;
    const height = window.innerHeight;
    rows = configuredRows || Math.max(2, Math.round(height / 200));
    
    let colTypes = [];
    const types = getGridTypes();
    
    let totalRatio = 0;
    types.forEach(t => { totalRatio += (t === 'music' ? 1 : 0.667); });
    const avgColWidth = (height / rows) * (totalRatio / types.length);
    
    cols = Math.max(1, Math.round(width / avgColWidth));
    for (let i = 0; i < cols; i++) {
        colTypes.push(types[i % types.length]);
    }

    for (let c = 0; c < cols; c++) {
        const type = colTypes[c];
        const columnEl = document.createElement('div');
        columnEl.className = `mosaic-column ${type}`;
        container.appendChild(columnEl);

        for (let r = 0; r < rows; r++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            
            const inner = document.createElement('div');
            inner.className = 'tile-inner';
            
            const front = document.createElement('div');
            front.className = 'face front';
            const imgFront = document.createElement('img');
            const frontSrc = getRandomArtwork(type);
            imgFront.src = frontSrc;
            imgFront.setAttribute('data-original-src', frontSrc);
            imgFront.onload = () => imgFront.classList.add('loaded');
            front.appendChild(imgFront);
            
            const back = document.createElement('div');
            back.className = 'face back';
            const imgBack = document.createElement('img');
            const backSrc = getRandomArtwork(type);
            imgBack.src = backSrc;
            imgBack.setAttribute('data-original-src', backSrc);
            imgBack.onload = () => imgBack.classList.add('loaded');
            back.appendChild(imgBack);
            
            inner.appendChild(front);
            inner.appendChild(back);
            tile.appendChild(inner);
            columnEl.appendChild(tile);
            
            tiles.push({ el: tile, imgFront: imgFront, imgBack: imgBack, isFlipped: false, type: type });
        }
    }
}

function initFlowGrid() {
    const container = document.getElementById('mosaic-container');
    container.innerHTML = '';
    container.className = 'mosaic-container flow-mode';
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    rows = configuredRows || Math.max(2, Math.round(height / 200));
    const rowHeight = height / rows;
    
    const types = getGridTypes();
    
    for (let r = 0; r < rows; r++) {
        const type = types[r % types.length];
        const rowEl = document.createElement('div');
        rowEl.className = `flow-row ${type}`;
        rowEl.style.height = `${rowHeight}px`;
        rowEl.style.position = 'relative';
        
        const speedLevel = window.flipSpeed || 3;
        const duration = 60 - (speedLevel * 10) + Math.random() * 10;
        const itemWidth = type === 'music' ? rowHeight : rowHeight * 0.667;
        
        const itemsNeeded = Math.ceil(width / itemWidth) + 2;
        
        for (let i = 0; i < itemsNeeded; i++) {
            spawnFlowTile(rowEl, type, itemWidth, width, duration, i * itemWidth - itemWidth);
        }
        
        const spawnInterval = (itemWidth / width) * duration * 1000;
        setInterval(() => {
            spawnFlowTile(rowEl, type, itemWidth, width, duration, -itemWidth);
        }, spawnInterval);
        
        container.appendChild(rowEl);
    }
}

function spawnFlowTile(rowEl, type, itemWidth, screenWidth, duration, startX) {
    const tile = document.createElement('div');
    tile.className = 'flow-tile';
    tile.style.width = `${itemWidth}px`;
    tile.style.height = '100%';
    tile.style.position = 'absolute';
    tile.style.left = '0';
    tile.style.top = '0';
    
    const img = document.createElement('img');
    const src = getRandomArtwork(type);
    img.src = src;
    img.setAttribute('data-original-src', src);
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.border = '1px solid rgba(0,0,0,0.5)';
    img.style.backgroundColor = '#222';
    
    tile.appendChild(img);
    rowEl.appendChild(tile);
    
    const speed = screenWidth / duration; 
    const distanceToTravel = (screenWidth + itemWidth) - startX;
    const travelTime = distanceToTravel / speed;
    
    const anim = tile.animate([
        { transform: `translateX(${startX}px)` },
        { transform: `translateX(${screenWidth + itemWidth}px)` }
    ], {
        duration: travelTime * 1000,
        easing: 'linear',
        fill: 'forwards'
    });
    
    anim.onfinish = () => {
        activeArtworks.delete(img.getAttribute('data-original-src'));
        tile.remove();
    };
}

function flipRandomTile() {
    if (tiles.length === 0) return;
    const availableTiles = tiles.filter(t => !t.el.classList.contains('flipping'));
    if (availableTiles.length === 0) return;
    const tile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
    
    tile.el.classList.add('flipping');
    tile.isFlipped = !tile.isFlipped;
    
    if (tile.isFlipped) {
        tile.el.classList.add('is-flipped');
        setTimeout(() => {
            tile.imgFront.classList.remove('loaded');
            const prevSrc = tile.imgFront.getAttribute('data-original-src');
            const newSrc = getRandomArtwork(tile.type, prevSrc);
            tile.imgFront.src = newSrc;
            tile.imgFront.setAttribute('data-original-src', newSrc);
        }, 300);
    } else {
        tile.el.classList.remove('is-flipped');
        setTimeout(() => {
            tile.imgBack.classList.remove('loaded');
            const prevSrc = tile.imgBack.getAttribute('data-original-src');
            const newSrc = getRandomArtwork(tile.type, prevSrc);
            tile.imgBack.src = newSrc;
            tile.imgBack.setAttribute('data-original-src', newSrc);
        }, 300);
    }
    
    setTimeout(() => {
        tile.el.classList.remove('flipping');
    }, 1200);
}

function startFlipping() {
    const flipCount = Math.max(1, Math.floor((cols * rows) / 20));
    const speedLevel = window.flipSpeed || 3;
    let baseInterval = 1500, randomRange = 1000;
    if (speedLevel === 1) { baseInterval = 4500; randomRange = 3000; }
    else if (speedLevel === 2) { baseInterval = 3000; randomRange = 2000; }
    else if (speedLevel === 4) { baseInterval = 750; randomRange = 500; }
    else if (speedLevel === 5) { baseInterval = 300; randomRange = 200; }
    
    for (let i = 0; i < flipCount; i++) {
        setTimeout(() => {
            setInterval(flipRandomTile, baseInterval + Math.random() * randomRange);
        }, Math.random() * baseInterval);
    }
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (animationType === 1) initFlowGrid();
        else initFlipGrid();
    }, 500);
});

// Instant startup - No loading delay!
function init() {
    if (animationType === 1) {
        initFlowGrid();
    } else {
        initFlipGrid();
        startFlipping();
    }
    // Fetch latest fresh artworks in the background
    fetchArtworks();
}

init();

// Fix focus issue: allow exiting screensaver via key or click inside WebView2
window.addEventListener('keydown', () => { if (window.chrome && window.chrome.webview) window.chrome.webview.postMessage('exit'); });
window.addEventListener('mousedown', () => { if (window.chrome && window.chrome.webview) window.chrome.webview.postMessage('exit'); });
window.addEventListener('mousemove', () => { if (window.chrome && window.chrome.webview) window.chrome.webview.postMessage('mousemove'); });
