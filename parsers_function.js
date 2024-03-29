import puppeteer from "puppeteer";
import {sendMessage} from './gpts_requests.js'
import {openaiChat} from './gpts_requests.js'
import {createPost} from './create_post.js'
// import {createImg} from "./generate_img.js";

export const getPageTitle = async (page) => {
    return await page.evaluate(() => {
        return (
            document
                .querySelector(".columns-container h1")
                .innerHTML.replace(/^\s+|\s+$/g, "")
        );
    });
};

export const getMeinInf = async (page) => {
    const meinInf = await page.evaluate(() => {
        const parentDiv = document.querySelector(".columns-container .post-content").children;

        const postContent = [];

        for (let i = 0; i < parentDiv.length; i++) {
            const child = parentDiv[i];
            if (child.tagName === "P" || child.tagName === "H2" || child.tagName === "UL" || child.tagName === "OL") {
                postContent.push(`${child.tagName}: ${child.textContent}`);
            } else if (child.tagName === "DIV") {
                const div = child.children;
                // postContent.push('--', div.tagName)
                for (let j = 0; j < div.length; j++) {
                    const divChild = div[j];
                    // postContent.push('----', divChild.tagName)
                    if (divChild.tagName !== "IMG") {
                        postContent.push(`${divChild.tagName}: ${divChild.textContent}`);
                    }
                }
            } else if (child.tagName === "FIGURE") {
                postContent.push(
                    `${child.children[0].children[0].src}`
                );
            }
        }

        return postContent.join("\n");
    });

    return meinInf;
};

export const getPagesNumber = async (page) => {
    return await page.evaluate(() => {
        const list = document.querySelector('.pagination-wrapper').querySelectorAll('li');
        return list.length;
    });
}

export const getPostFromPage = async (page) => {
    return await page.evaluate(() => {
        const allPost = Array.from(document.querySelectorAll('.blog-image a')).map(post => post.href);
        return allPost;
    });
}

export const getAllPostUrl = async () => {
    const allPost = []

    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto(
        "https://www.crepslocker.com/blogs/sneaker-news/"
    );

    const numberPages = await getPagesNumber(page);
    console.log(numberPages)
    await browser.close();

    for (let pageNum = 1; pageNum <= 1; pageNum++) {
        const browser = await puppeteer.launch({
            headless: false,
        });
        const page = await browser.newPage();

        await page.goto(
            `https://www.crepslocker.com/blogs/sneaker-news?page=${pageNum}`
        );

        const allPostFromPage = await getPostFromPage(page);
        const pattern = /([^/]+)\/?$/;
        allPostFromPage.map((postUrl) => {
            allPost.push(postUrl.match(pattern)[1])
        })

        await browser.close();
    }

    return allPost
}


export const  addNewPost = async (postDonorSlug) => {
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto(
        `https://fotl.com.ua/uk/blog/news/${postDonorSlug}`
    );

    // const language = "ukrainian";

    const title = await getPageTitle(page);
    const content = await getMeinInf(page);
    const characterCount = content.length;

    if (characterCount < 1500) {
        console.log('title: ' + title);
        console.log('character count: ', characterCount);
        console.log('content: ' + content);
        console.log('Skipping...');
    } else {

        // const answer = await sendMessage(title, content);
        // const imgId = await createImg(title)

        // let answer;
        // try {
        //     answer = await sendMessage(title, content, language);
        // } catch (error) {
        //     console.error("Помилка під час відправки повідомлення:", error);
        //     await browser.close();
        //     return;
        // }

        //await createPost(answer.title, answer.content, postDonorSlug, imgId);

        await browser.close();

        console.log('title: ' + title);
        console.log('character count: ', characterCount);
        console.log('content: ' + content);
        // console.log('-----------------');
        // console.log('answer ' + answer);
        console.log('Adding...');
    }

    return 1;
};



