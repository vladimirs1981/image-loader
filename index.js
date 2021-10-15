const imageContainer = document.getElementById('image-container');
const button = document.getElementById('button');
const loader = document.getElementById('loader');

const apiKey = 'Y9QXVgfTOVX0MDoTWFKtvtYXQwZaOceLP755xM_d0SM';

const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
document.body.appendChild(lightbox);

function changeView() {
    if (imageContainer.classList.contains('grid')) {
        imageContainer.classList.remove('grid');
        button.innerText = 'grid';
    } else {
        imageContainer.classList.add('grid');
        button.innerText = 'list';
    }
}

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;

let count = 15;

apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

function updatedCount(newCount) {
    newCount = 20;
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${newCount}`;
}

function imageLoaded() {
    imagesLoaded++;
    console.log(imagesLoaded);
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
        updatedCount();
    }
}

function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

function displayPhotosWithInfo() {
    //update info for social part, set opacity if unavaiable
    function updateSocialData(api_data, targetElement, title) {
        if (api_data == '' || api_data === null) {
            targetElement.style.opacity = 0.5;
            return title + 'Not available';
        } else {
            targetElement.style.opacity = 1;
            return title + `${api_data}`;
        }
    }

    imagesLoaded = 0;
    totalImages = photosArray.length;
    console.log(totalImages);
    photosArray.forEach((photo) => {
        //create image
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description + photo.current_user_collections.title,
            title: photo.alt_description,
        });
        //create container for all info
        const all = document.createElement('div');
        all.classList.add('all');

        //container for avatar and username
        const userInfo = document.createElement('div');
        userInfo.classList.add('userInfo');

        //likes and downloads
        const stats = document.createElement('div');
        stats.classList.add('stats');

        //url, twitter, instagram
        const social = document.createElement('div');
        social.classList.add('social');

        //photo link
        const photoLink = document.createElement('a');
        photoLink.href = photo.links.html;
        photoLink.innerText = 'Link: ' + photo.links.html;

        //likes
        const likes = document.createElement('small');
        likes.classList.add('likes');
        likes.innerText = 'Likes: ' + photo.likes;

        //downloads
        const downloads = document.createElement('small');
        downloads.innerText = 'Downloads: ' + photo.likes;

        //avatar image
        const avatar = document.createElement('img');
        avatar.classList.add('avatar');
        setAttributes(avatar, { src: photo.user.profile_image.small });

        //username
        const username = document.createElement('small');
        username.innerText = photo.user.username;

        //portfolio URL
        const portfolioURL = document.createElement('small');
        portfolioURL.innerHTML = updateSocialData(
            photo.user.portfolio_url,
            portfolioURL,
            'URL: '
        );

        const twitter = document.createElement('small');
        twitter.innerText = updateSocialData(
            photo.user.social.twitter_username,
            twitter,
            'Twitter: '
        );

        const instagram = document.createElement('small');
        instagram.innerText = updateSocialData(
            photo.user.social.instagram_username,
            instagram,
            'Instagram: '
        );

        img.addEventListener('click', (e) => {
            lightbox.classList.add('active');
            const image = document.createElement('img');
            image.src = img.src;
            image.classList.add('lightBoxImage');

            while (lightbox.firstChild) {
                lightbox.removeChild(lightbox.firstChild);
            }
            lightbox.appendChild(all);
        });

        lightbox.addEventListener('click', (e) => {
            lightbox.classList.remove('active');
        });

        //check when finish loading
        img.addEventListener('load', imageLoaded);

        userInfo.appendChild(avatar);
        userInfo.appendChild(username);
        stats.appendChild(likes);
        stats.appendChild(downloads);
        social.appendChild(portfolioURL);
        social.appendChild(twitter);
        social.appendChild(instagram);
        all.appendChild(userInfo);
        all.appendChild(img);
        all.appendChild(stats);
        all.appendChild(photoLink);
        all.appendChild(social);
        imageContainer.appendChild(all);
    });
}

async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();

        console.log(photosArray);
        displayPhotosWithInfo();
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener('scroll', () => {
    if (
        window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 2000 &&
        ready
    ) {
        ready = false;
        loader.hidden = false;
        getPhotos();
    }
});

getPhotos();
