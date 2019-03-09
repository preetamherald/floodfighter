//version
var appVersion = '7v.00';

//Files to cache
var files = [
    './',
    'index.html',
    'favicon.png',
    'vive.png',
    'daydream.png',
    'vid.mp4',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css'
]

//install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(appVersion)
            .then(cache=> {
                return cache.addAll(files)
                    .catch(err =>{
                        console.error('error adding files to cache', err);
                    })
            })
    )
    console.info('SW Installed');
    self.skipWaiting();
})

//Activate
self.addEventListener('activate', event =>{
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache =>{
                        if(cache !== appVersion){
                            console.info('Deleting old Cache', cache)
                            return caches.delete(cache);
                        }
                    })
                )
            })
    )
    return self.clients.claim();
})

//fetch

self.addEventListener('fetch', event=>{
    console.info('SW fetch', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(res=> {
                return res || fetch(event.request);
            })
    )
})