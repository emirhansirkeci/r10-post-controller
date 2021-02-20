const puppeteer = require('puppeteer');
const electron = require('electron')
const { ipcRenderer } = electron;

process.setMaxListeners(Infinity);

const startBtn = document.querySelector('#startBtn');
const url = document.querySelector('#url');
const info = document.querySelector('#info');
const lastPost = document.querySelector('#lastPost');

class Scrape{
    constructor(){
        this.previousPostControl = false;
        this.previousPost = null;
        this.currentPost = null;
    }

    control = (postTopic, postLink) => {
        if(this.previousPostControl == false){
            this.previousPost = postTopic;
            this.previousPostControl = true;
            info.innerText = "Yeni Gönderiler Aranmaya Başlandı."
        } else {
            this.currentPost = postTopic;

            if(this.currentPost == this.previousPost){
                info.innerText = "Henüz Yeni Gönderi Yok."
                lastPost.innerHTML = "<b>Son Gönderi: </b>" + postTopic;
            } else {
                info.innerText = "Yeni Gönderi Bulundu."
                lastPost.innerHTML = "<b>Son Gönderi: </b>" + postTopic;
                window.open(postLink);
                this.previousPostControl = false;
            }
        }
    }

    run = async (link) => {
        const browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();
        await page.goto(link, { waitUntil: 'networkidle2' });
      
        
        const posts = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("#inlinemodform > ul:nth-child(9) li.thread"))
            .map((items) => {
                if(items.childNodes[1] != undefined){
                    if(items.childNodes[1].childNodes[1].childNodes[1].className != "fa fa-bullhorn r"){
                        return {
                            topic: items.childNodes[1].childNodes[5].childNodes[1].innerText,
                            link: items.childNodes[1].childNodes[5].childNodes[1].childNodes[3].href
                        }
                    }
                }
            }).filter(logos => logos != null)
        })
        

        this.control(posts[0].topic, posts[0].link);
        
        await browser.close();
    };
}

const Scraper = new Scrape();

ipcRenderer.on('loadControl', (err, data) => {
    startBtn.addEventListener("click", () => {
        info.innerText = "Arama Başlatılıyor..."
        setInterval(() => {Scraper.run(url.value)}, 15000);
    })
})
